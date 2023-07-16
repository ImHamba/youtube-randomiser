import { writable } from 'svelte/store';

export const videoIDStore = writable<IVideoData[]>([]);
