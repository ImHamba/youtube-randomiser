import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import { currentMixLSKey, savedLocalMixesLSKey } from './misc/localKeys';

export const videoIDStore = writable<IVideoData[]>([
	{
		channelTitle: 'abc',
		title: 'abc',
		videoID: 'P_A0qQ7AuK8',
		thumbnailUrl:
			'https://yt3.ggpht.com/ytc/AOPolaRZ_YQDWsp_xli4C-dj0ArYih76vbn_Ck-wg8Dz8w=s48-c-k-c0x00ffffff-no-rj'
	}
]);

let currentMixJson: string | null = null;
if (browser) {
	currentMixJson = localStorage.getItem(currentMixLSKey);
}
export const groupedVideoStore = writable<IGroupedVideoData>(
	currentMixJson == null ? [] : JSON.parse(currentMixJson)
);

// attempt to load saved local mixes from local storage and initialise local saved mix store with them
let savedLocalMixesJson: string | null = null;
if (browser) {
	savedLocalMixesJson = localStorage.getItem(savedLocalMixesLSKey);
}
export const savedLocalMixesStore: Writable<IMix[]> = writable(
	savedLocalMixesJson == null ? [] : JSON.parse(savedLocalMixesJson)
);

export const savedUserMixesStore: Writable<IUserMix[]> = writable([]);
