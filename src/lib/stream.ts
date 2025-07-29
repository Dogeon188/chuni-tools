import { derived, writable, type Readable } from 'svelte/store'

/**
 * Creates an async Readable store that resolves a promise-based initializer.
 *
 * This function creates a writable store that automatically executes an async
 * initializer function and updates the store value when the promise resolves.
 * The store starts with an optional initial value and updates once the async
 * operation completes.
 *
 * @template T The type of value the store will contain
 * @param initializer A function that returns a Promise<T> to initialize the store
 * @param initial_value Optional initial value for the store before the promise resolves
 * @returns A Readable store that will contain the resolved value
 *
 * @example
 * ```typescript
 * // Create a stream that fetches user data
 * const userStream = Stream(
 *   () => fetch('/api/user').then(r => r.json()),
 *   { name: 'Loading...' } // initial value
 * );
 *
 * // Subscribe to the stream
 * userStream.subscribe(user => console.log(user));
 * ```
 */
export function Stream<T>(initializer: () => Promise<T>, initial_value?: T): Readable<T> {
	return writable<T>(initial_value, (set) => {
		const start = Date.now()
		Promise.resolve(initializer()).then((value) => {
			if (start > 0) {
				set(value)
			}
		})
		return () => {
			// Cleanup if needed
		}
	})
}

export const noUpdate = Symbol('noUpdate')
type NoUpdateSymbol = typeof noUpdate

/**
 * Creates a derived store that asynchronously transforms values from source stores.
 *
 * This function creates a derived store that executes an async callback whenever
 * the source store(s) change. It handles race conditions by ensuring only the
 * most recent async operation updates the store value. This is useful for
 * performing async operations (like API calls) that depend on reactive data.
 *
 * The function is overloaded to support both single store and multiple stores:
 * - Single store: transforms one Readable<S> to Readable<T>
 * - Multiple stores: transforms an array of Readable stores to Readable<R>
 *
 * @template S The type of the source store value (single store variant)
 * @template T The type of the derived store value (single store variant)
 * @template R The type of the derived store value (multiple stores variant)
 * @param stores Either a single Readable store or an array of Readable stores
 * @param callback Async function that transforms the store value(s)
 * @param initial_value Optional initial value for the derived store
 * @returns A Readable store containing the transformed value
 *
 * @example
 * ```typescript
 * // Single store example - fetch user details when userId changes
 * const userId = writable(1);
 * const userDetails = DerivedStream(
 *   userId,
 *   async (id) => {
 *     const response = await fetch(`/api/users/${id}`);
 *     return response.json();
 *   },
 *   null // initial value
 * );
 *
 * // Multiple stores example - combine search query and filters
 * const searchQuery = writable('');
 * const filters = writable({});
 * const searchResults = DerivedStream(
 *   [searchQuery, filters],
 *   async ([query, filterObj]) => {
 *     const response = await fetch('/api/search', {
 *       method: 'POST',
 *       body: JSON.stringify({ query, filters: filterObj })
 *     });
 *     return response.json();
 *   },
 *   []
 * );
 * ```
 */
export function DerivedStream<S, T>(
	stores: Readable<S>,
	callback: (value: S) => Promise<T | NoUpdateSymbol>,
	initial_value?: T
): Readable<T>
export function DerivedStream<S extends Readable<unknown>[], T>(
	stores: S,
	callback: (values: {
		[K in keyof S]: S[K] extends Readable<infer U> ? U : never
	}) => Promise<T | NoUpdateSymbol>,
	initial_value?: T | undefined
): Readable<T>
export function DerivedStream<S, T>(
	stores: Readable<S> | Readable<unknown>[],
	callback: (values: S | unknown[]) => Promise<T | NoUpdateSymbol>,
	initial_value?: T | undefined
): Readable<T> {
	// Track the timestamp of the most recent async operation to prevent race conditions
	let previous = 0

	return derived(
		stores,
		($stores, set) => {
			// Record when this async operation started
			const start = Date.now()
			Promise.resolve(callback($stores)).then((value) => {
				// Only update if this is still the most recent operation
				if (start > previous) {
					previous = start
					if (value !== noUpdate) {
						set(value)
					}
				}
			})
		},
		initial_value
	)
}
