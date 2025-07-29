/**
 * CWR = Cross-Window Request
 *
 * This module implements a cross-window communication system for making requests
 * to parent windows and handling responses asynchronously. It's designed to work
 * with popup windows or iframes that need to communicate with their parent.
 */

import { browser } from '$app/environment'
import type { Difficulty } from '$lib/chuninet/song'
import { chuniNet } from '$lib/chuninet/website'
import { getPostMessageFunction } from '$lib/web'
import { v4 } from 'uuid'

// Configuration constants
/** Timeout for each individual request attempt in milliseconds */
const REQUEST_TIMEOUT_MS = 2000
/** Maximum number of retry attempts before giving up */
const MAX_RETRY_ATTEMPTS = 3

/**
 * Represents a cross-page request with automatic retry logic and timeout handling.
 * Each request has a unique UUID for tracking and implements a promise-based API.
 */
class CrossWindowRequest<T> {
	/** The payload data to send with the request */
	readonly payload: unknown
	/** Promise that resolves when the request completes */
	readonly promise: Promise<T>
	/** Unique identifier for this request */
	readonly uuid: string

	/** Whether this request has been acknowledged by the target */
	private handled = false
	/** Current retry attempt count */
	private retryCount = 0
	/** Timeout handle for cleanup */
	private timeout?: NodeJS.Timeout
	/** Promise resolve function */
	private resolve: (value: T) => void = () => {}
	/** Promise reject function */
	private reject: (reason: unknown) => void = () => {}

	constructor(payload: unknown) {
		this.uuid = v4()
		this.payload = payload
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})

		this.initializeRequest()
	}

	/**
	 * Initializes the request by setting up retry logic and sending the initial request
	 */
	private initializeRequest(): void {
		try {
			const send = browser 
				? getPostMessageFunction(window.opener, chuniNet)
				: () => {} // stub function when not in browser

			const attemptRequest = (): void => {
				if (this.handled) return

				if (this.retryCount < MAX_RETRY_ATTEMPTS) {
					this.retryCount++
					send('request', this.payload, this.uuid)
					this.timeout = setTimeout(attemptRequest, REQUEST_TIMEOUT_MS)
				} else {
					// If at SSR, just skip the timeout logic
					if (!browser) return

					// Reject the promise after max attempts
					this.reject(
						new Error(
							`Request timed out after ${MAX_RETRY_ATTEMPTS} attempts (${REQUEST_TIMEOUT_MS * MAX_RETRY_ATTEMPTS}ms total)`
						)
					)
				}
			}

			// Send initial request
			send('request', this.payload, this.uuid)
			this.timeout = setTimeout(attemptRequest, REQUEST_TIMEOUT_MS)
		} catch (err) {
			this.reject(err)
		}
	}

	/**
	 * Marks the request as handled and clears any pending timeouts
	 */
	markAsHandled(): void {
		this.handled = true
		if (this.timeout) {
			clearTimeout(this.timeout)
			this.timeout = undefined
		}
	}

	/**
	 * Resolves the request with the provided data
	 */
	resolveWith(data: T): void {
		this.resolve(data)
	}

	/**
	 * Rejects the request with the provided error
	 */
	rejectWith(error: unknown): void {
		this.reject(error)
	}
}

/** Global registry to track active cross-page requests */
const activeRequests = new Map<string, CrossWindowRequest<unknown>>()

/**
 * Cleans up all pending requests. Useful for cleanup when the page is unloading.
 */
export function cleanupAllRequests(): void {
	for (const request of activeRequests.values()) {
		request.markAsHandled()
		request.rejectWith(new Error('Request cancelled due to cleanup'))
	}
	activeRequests.clear()
}

/**
 * Gets the count of currently active requests.
 * Useful for debugging or monitoring purposes.
 */
export function getActiveRequestCount(): number {
	return activeRequests.size
}

/**
 * Handles incoming message events from parent windows or other frames.
 * Processes both ping acknowledgments and response messages.
 */
function handleMessageEvent(event: CWRMessageEvent<unknown>): void {
	const { action, payload, uuid } = event.data

	// Validate that we have a request with this UUID
	const request = activeRequests.get(uuid)
	if (!request) {
		console.error(`Received message for unknown request UUID: ${uuid}`)
		return
	}

	switch (action) {
		case 'ping':
			// Acknowledge that the request was received
			request.markAsHandled()
			break

		case 'respond':
			// Handle the actual response
			if (payload.error) {
				console.error(`Error handling request ${payload.target}:`, payload.error)
				request.rejectWith(payload.error)
			} else {
				request.resolveWith(payload.data)
			}
			// Clean up the request from our registry
			activeRequests.delete(uuid)
			break

		default:
			// Ignore unknown actions
			break
	}
}

/**
 * Maps the available cross-page request targets to their return types.
 * This provides type safety for the requestFor function.
 */
export interface CWRPayloadTypes {
	/** Player statistics including name, honor, rating, etc. */
	playerStats: PlayerStats
	/** Complete play history records */
	playHistory: PlayRecord[]
	/** Recent play records with timestamps */
	recentRecord: HistoryRecord[]
	/** Best score records for a specific difficulty */
	bestRecord: BestRecord[]
	/** Play count for a specific song and difficulty */
	songPlayCount: number
}

/**
 * Makes a cross-page request for best records with a specific difficulty.
 * @param target - Must be 'bestRecord'
 * @param difficulty - The difficulty level to request
 * @returns Promise resolving to an array of best records
 */
export async function requestFor(
	target: 'bestRecord',
	difficulty: Difficulty
): Promise<BestRecord[]>

/**
 * Makes a cross-page request for song play count with specific difficulty and song index.
 * @param target - Must be 'songPlayCount'
 * @param difficulty - The difficulty level
 * @param idx - The song index identifier
 * @returns Promise resolving to the play count number
 */
export async function requestFor(
	target: 'songPlayCount',
	difficulty: Difficulty,
	idx: string
): Promise<number>

/**
 * Makes a cross-page request for any available data type.
 * @param target - The type of data to request
 * @returns Promise resolving to the requested data type
 */
export async function requestFor<K extends keyof CWRPayloadTypes>(
	target: K
): Promise<CWRPayloadTypes[K]>

/**
 * Implementation of the cross-page request function.
 * Creates a new request, registers it, and returns a promise that resolves when the response is received.
 *
 * @param target - The type of data to request from the parent window
 * @param difficulty - Optional difficulty parameter for certain request types
 * @param idx - Optional song index parameter for songPlayCount requests
 * @returns Promise that resolves to the requested data
 *
 * @example
 * ```typescript
 * // Request player statistics
 * const stats = await requestFor('playerStats')
 *
 * // Request best records for a specific difficulty
 * const records = await requestFor('bestRecord', Difficulty.MASTER)
 *
 * // Request play count for a specific song
 * const count = await requestFor('songPlayCount', Difficulty.EXPERT, 'song123')
 * ```
 */
export async function requestFor<K extends keyof CWRPayloadTypes>(
	target: K,
	difficulty?: Difficulty,
	idx?: string
): Promise<CWRPayloadTypes[K]> {
	const payload: CWRPayload<unknown> = {
		target,
		data: { difficulty, idx }
	}

	const request = new CrossWindowRequest<CWRPayloadTypes[K]>(payload)
	activeRequests.set(request.uuid, request as unknown as CrossWindowRequest<unknown>)

	return request.promise
}

// prevent SSR reference to window
if (browser) {
	// Register the global message event listener
	window.addEventListener('message', handleMessageEvent, false)

	// Cleanup requests when the page is unloading to prevent memory leaks
	window.addEventListener('beforeunload', cleanupAllRequests, false)
}
