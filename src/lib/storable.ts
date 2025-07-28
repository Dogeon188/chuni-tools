import { browser } from '$app/environment'
import { writable, type Writable } from 'svelte/store'

//#region Storable Configurations

// Base storable interface
interface BaseStorableConfig<T> {
	key: string
	defaultValue: T
}

// Boolean storable configuration
interface BooleanStorableConfig extends BaseStorableConfig<boolean> {
	type: 'boolean'
}

// Flag storable configuration (list of booleans)
interface FlagStorableConfig extends BaseStorableConfig<Record<string, boolean>> {
	type: 'flag'
	flags: readonly string[]
}

// String storable configuration
interface StringStorableConfig extends BaseStorableConfig<string> {
	type: 'string'
	legalValues?: readonly string[]
}

// Number storable configuration
interface NumberStorableConfig extends BaseStorableConfig<number> {
	type: 'number'
	min?: number
	max?: number
}

// Union type for all configs
type StorableConfig =
	| BooleanStorableConfig
	| FlagStorableConfig
	| StringStorableConfig
	| NumberStorableConfig

//#region Storable Interfaces

// Base storable store interface
interface BaseStorableStore<T> extends Writable<T> {
	reset: () => void
	getConfig: () => StorableConfig
}

// Extended interfaces for specific types
interface BooleanStorableStore extends BaseStorableStore<boolean> {
	toggle: () => void
	getConfig: () => BooleanStorableConfig
}

interface FlagStorableStore extends BaseStorableStore<Record<string, boolean>> {
	toggleFlag: (flag: string) => void
	getConfig: () => FlagStorableConfig
}

interface StringStorableStore extends BaseStorableStore<string> {
	getConfig: () => StringStorableConfig
}

interface NumberStorableStore extends BaseStorableStore<number> {
	getConfig: () => NumberStorableConfig
}

//#region Validators

// Abstract validator interface
interface StorableValidator<T> {
	validate(value: T): T
}

// Concrete validators
class BooleanValidator implements StorableValidator<boolean> {
	validate(value: boolean): boolean {
		return value
	}
}

class StringValidator implements StorableValidator<string> {
	constructor(private legalValues?: readonly string[]) {}

	validate(value: string): string {
		if (!this.legalValues || this.legalValues.includes(value)) {
			return value
		}
		return this.legalValues[0] || ''
	}
}

class NumberValidator implements StorableValidator<number> {
	constructor(
		private min?: number,
		private max?: number
	) {}

	validate(value: number): number {
		if (typeof value !== 'number' || isNaN(value)) {
			return this.min ?? 0
		}
		if (this.min !== undefined && value < this.min) {
			return this.min
		}
		if (this.max !== undefined && value > this.max) {
			return this.max
		}
		return value
	}
}

class FlagValidator implements StorableValidator<Record<string, boolean>> {
	constructor(private flags: readonly string[]) {}

	validate(value: Record<string, boolean>): Record<string, boolean> {
		const result: Record<string, boolean> = {}
		for (const flag of this.flags) {
			result[flag] = value[flag] ?? false
		}
		return result
	}
}

//#region Storage utilities

function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue

	try {
		const stored = localStorage.getItem(key)
		if (stored === null) return defaultValue
		return JSON.parse(stored)
	} catch {
		return defaultValue
	}
}

function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return

	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {
		// Silently fail if localStorage is not available
	}
}

//#region Storable Classes

// Base storable class using polymorphism
abstract class BaseStorable<T> implements Writable<T> {
	protected store: Writable<T>
	protected validator: StorableValidator<T>
	protected config: BaseStorableConfig<T> & { type: string }

	constructor(
		config: BaseStorableConfig<T> & { type: string },
		validator: StorableValidator<T>
	) {
		this.config = config
		this.validator = validator

		// Load and validate initial value
		let initialValue = loadFromStorage(config.key, config.defaultValue)
		initialValue = this.validator.validate(initialValue)

		// Create the writable store
		this.store = writable(initialValue)
	}

	// Svelte store methods
	get subscribe() {
		return this.store.subscribe
	}

	set = (value: T): void => {
		const validatedValue = this.validator.validate(value)
		this.store.set(validatedValue)
		saveToStorage(this.config.key, validatedValue)
	}

	update = (updater: (value: T) => T): void => {
		this.store.update((currentValue) => {
			const newValue = updater(currentValue)
			const validatedValue = this.validator.validate(newValue)
			saveToStorage(this.config.key, validatedValue)
			return validatedValue
		})
	}

	// Common methods
	reset = (): void => {
		this.set(this.config.defaultValue)
	}
}

// Specific storable implementations
export class BooleanStorable
	extends BaseStorable<boolean>
	implements BooleanStorableStore
{
	declare protected config: BooleanStorableConfig

	constructor(config: BooleanStorableConfig) {
		super(config, new BooleanValidator())
	}

	static create(key: string, defaultValue: boolean): BooleanStorableStore {
		const config: BooleanStorableConfig = {
			type: 'boolean',
			key,
			defaultValue
		}
		return new BooleanStorable(config)
	}

	toggle = (): void => {
		this.update((value) => !value)
	}

	getConfig = (): BooleanStorableConfig => {
		return this.config
	}
}

export class FlagStorable
	extends BaseStorable<Record<string, boolean>>
	implements FlagStorableStore
{
	declare protected config: FlagStorableConfig

	constructor(config: FlagStorableConfig) {
		super(config, new FlagValidator(config.flags))
	}

	static create(
		key: string,
		flags: readonly string[],
		defaultValue?: Record<string, boolean>
	): FlagStorableStore {
		const config: FlagStorableConfig = {
			type: 'flag',
			key,
			flags,
			defaultValue:
				defaultValue ??
				flags.reduce((acc, flag) => ({ ...acc, [flag]: false }), {})
		}
		return new FlagStorable(config)
	}

	toggleFlag = (flag: string): void => {
		this.update((value) => ({
			...value,
			[flag]: !value[flag]
		}))
	}

	getConfig = (): FlagStorableConfig => {
		return this.config
	}
}

export class StringStorable extends BaseStorable<string> implements StringStorableStore {
	declare protected config: StringStorableConfig

	constructor(config: StringStorableConfig) {
		super(config, new StringValidator(config.legalValues))
	}

	static create(
		key: string,
		defaultValue: string,
		legalValues?: readonly string[]
	): StringStorableStore {
		const config: StringStorableConfig = {
			type: 'string',
			key,
			defaultValue,
			legalValues
		}
		return new StringStorable(config)
	}

	getConfig = (): StringStorableConfig => {
		return this.config
	}
}

export class NumberStorable extends BaseStorable<number> implements NumberStorableStore {
	declare protected config: NumberStorableConfig

	constructor(config: NumberStorableConfig) {
		super(config, new NumberValidator(config.min, config.max))
	}

	static create(
		key: string,
		defaultValue: number,
		min?: number,
		max?: number
	): NumberStorableStore {
		const config: NumberStorableConfig = {
			type: 'number',
			key,
			defaultValue,
			min,
			max
		}
		return new NumberStorable(config)
	}

	getConfig = (): NumberStorableConfig => {
		return this.config
	}
}

export type Storable =
	| BooleanStorableStore
	| FlagStorableStore
	| StringStorableStore
	| NumberStorableStore
