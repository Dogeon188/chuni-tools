import { derived, writable, type Readable } from 'svelte/store';

export interface LogMessage {
	id: string;
	content: string;
	countdown: number;
	maxCountdown: number;
	timestamp: Date;
}

export interface LogHandle {
	id: string;
	updateContent: (content: string) => void;
	refreshCountdown: (countdown?: number) => void;
	remove: () => void;
}

class Logger {
	private messages = writable<LogMessage[]>([]);
	private intervalId: NodeJS.Timeout | null = null;
	private nextId = 0;

	constructor() {
		this.startCountdownTimer();
	}

	/**
	 * Get all messages as a readable store
	 */
	get allMessages(): Readable<LogMessage[]> {
		return this.messages;
	}

	/**
	 * Get the last message as a readable store
	 */
	get lastMessage(): Readable<LogMessage | null> {
		return derived(this.messages, ($messages) => {
			return $messages.length > 0 ? $messages[$messages.length - 1] : null;
		});
	}

	/**
	 * Log a new message with countdown
	 */
	log(content: string, countdown: number = 5000): LogHandle {
		const id = `msg_${this.nextId++}`;
		const message: LogMessage = {
			id,
			content,
			countdown,
			maxCountdown: countdown,
			timestamp: new Date()
		};

		this.messages.update(messages => [...messages, message]);

		return this.createHandle(id);
	}

	/**
	 * Create a handle for message manipulation
	 */
	private createHandle(id: string): LogHandle {
		return {
			id,
			updateContent: (content: string) => {
				this.updateMessageContent(id, content);
			},
			refreshCountdown: (countdown?: number) => {
				this.refreshMessageCountdown(id, countdown);
			},
			remove: () => {
				this.removeMessage(id);
			}
		};
	}

	/**
	 * Update message content
	 */
	private updateMessageContent(id: string, content: string): void {
		this.messages.update(messages => 
			messages.map(msg => 
				msg.id === id ? { ...msg, content } : msg
			)
		);
	}

	/**
	 * Refresh message countdown
	 */
	private refreshMessageCountdown(id: string, countdown?: number): void {
		this.messages.update(messages => 
			messages.map(msg => {
				if (msg.id === id) {
					const newCountdown = countdown !== undefined ? countdown : msg.maxCountdown;
					return { ...msg, countdown: newCountdown, maxCountdown: newCountdown };
				}
				return msg;
			})
		);
	}

	/**
	 * Remove a specific message by ID (public method)
	 */
	remove(id: string): void {
		this.removeMessage(id);
	}

	/**
	 * Remove a specific message
	 */
	private removeMessage(id: string): void {
		this.messages.update(messages => 
			messages.filter(msg => msg.id !== id)
		);
	}

	/**
	 * Start the countdown timer
	 */
	private startCountdownTimer(): void {
		this.intervalId = setInterval(() => {
			this.messages.update(messages => {
				const updatedMessages = messages
					.map(msg => ({ ...msg, countdown: msg.countdown - 100 }))
					.filter(msg => msg.countdown > 0);
				
				return updatedMessages;
			});
		}, 100); // Update every 100ms for smooth countdown
	}

	/**
	 * Stop the countdown timer
	 */
	destroy(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * Clear all messages
	 */
	clear(): void {
		this.messages.set([]);
	}

	/**
	 * Get current messages count
	 */
	get count(): Readable<number> {
		return derived(this.messages, ($messages) => $messages.length);
	}
}

// Create a singleton logger instance
export const logger = new Logger();

// Export the logger instance for direct access
export default logger;
