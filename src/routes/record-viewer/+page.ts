import { writable } from 'svelte/store'

export const _page = writable<'best' | 'recent' | 'history'>('best')
