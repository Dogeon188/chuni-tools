import { writable } from 'svelte/store'

export const _page = writable<'best' | 'current' | 'recent'>('best')
