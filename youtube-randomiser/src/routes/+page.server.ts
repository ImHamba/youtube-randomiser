import { SECRET_YT } from '$env/static/private';
export const actions = {
	getPlaylist: async ({ request }): Promise<IPlaylistDataResponse> => {
		const data = await request.formData();
		const playlistID = data.get('ytMediaID')?.toString();

		const etag = data.get('etag')?.toString() || '';

		if (playlistID == null) {
			return { success: false, status: 404, message: null };
		}

		// get playlist details e.g. playlist name, thumbnail etc.
		// const plDetails = await fetchPlaylistDetails(playlistID, etag);
		const plDetails = await fetchPlaylistDetails(playlistID, '')

		if (plDetails.status == 304) {
			// playlist is unchanged according to etag, no need to fetch all data again
			return { success: true, status: 304, message: null };

		} else if (plDetails.status == 200) {
			// get first 50 videos
			let plResponse = await fetchPlaylistItems(playlistID);
			let firstPlJson = plResponse.data;
			let allSnippets = firstPlJson.items;

			// calculate number of requests to fetch remaining videos in pages of 50 at a time
			const numAddlRequests =
				Math.ceil(firstPlJson.pageInfo.totalResults / firstPlJson.pageInfo.resultsPerPage) - 1;

			// get remaining videos in playlist
			if (numAddlRequests > 0) {
				let nextPageToken = firstPlJson.nextPageToken;

				for (let i = 0; i < numAddlRequests; i++) {
					let plResponse = await fetchPlaylistItems(playlistID, nextPageToken);
					let nextPageJson = plResponse.data;
					allSnippets = [...allSnippets, ...nextPageJson.items];
					nextPageToken = nextPageJson?.nextPageToken;
				}
			}

			// extract video info out of all collected snippets
			const videoData: IVideoData[] = allSnippets
				.map((e: any) => {
					let data;
					try {
						// check that resource has all required information and isnt private or removed
						if (
							// e.snippet.title != 'Private video' &&
							e.snippet?.videoOwnerChannelTitle &&
							e.snippet?.title &&
							e.snippet?.resourceId.videoId &&
							e.snippet?.thumbnails.default.url
						) {
							data = {
								channelTitle: e.snippet.videoOwnerChannelTitle,
								title: e.snippet.title,
								videoID: e.snippet.resourceId.videoId,
								thumbnailUrl: e.snippet.thumbnails.default.url
							};
						} else {
							console.log('Private video:', e.snippet);
						}
					} catch (error) {
						console.log('Playlist fetch error:', data);
					}

					return data;
				})

				// filter any undefined elements output by the map()
				.filter((e: any) => e !== undefined);

			let playlistData: IPlaylistData = {
				...plDetails.data,
				playlistId: playlistID,
				videos: videoData
			};
			return { success: true, status: 200, message: playlistData };
		} else {
			return { success: false, status: 404, message: null };
		}
	},

	getVideo: async ({ request }) => {
		const data = await request.formData();
		const videoID = data.get('ytMediaID')?.toString();

		if (videoID == null) {
			return { success: false, message: null };
		}

		let res: Response = await fetchVideo(videoID);

		if (res.status != 200) {
			return { success: false, message: null };
		}

		const resJson = await res.json();

		if (resJson.items.length == 0) {
			return { success: false, message: null };
		}

		const videoData: IVideoData = {
			channelTitle: resJson.items[0].snippet.channelTitle,
			title: resJson.items[0].snippet.title,
			videoID: videoID,
			thumbnailUrl: resJson.items[0].snippet.thumbnails.default.url
		};

		console.log('Returning data');
		return { success: true, message: videoData };
	}
};

const fetchPlaylistItems = async (playlistID: string, nextPageToken: string | null = null) => {
	const fetchURL = new URL('https://youtube.googleapis.com/youtube/v3/playlistItems');
	fetchURL.searchParams.append('playlistId', playlistID);
	fetchURL.searchParams.append('part', 'snippet');
	fetchURL.searchParams.append('maxResults', '50');
	fetchURL.searchParams.append('key', SECRET_YT);
	if (nextPageToken) {
		fetchURL.searchParams.append('pageToken', nextPageToken);
	}

	const res = await fetch(fetchURL);

	if (res.status == 200) {
		const resJson = await res.json();
		return { status: 200, data: resJson };
	} else if (res.status == 304) {
		return { status: 304, data: null };
	} else {
		return { status: 404, data: null };
	}
};

const fetchPlaylistDetails = async (
	playlistID: string,
	etag: string
): Promise<
	| {
			status: 200;
			data: Omit<IPlaylistData, 'playlistId' | 'videos'>;
	  }
	| {
			status: 304 | 404;
			data: null;
	  }
> => {
	const fetchURL = new URL('https://youtube.googleapis.com/youtube/v3/playlists');
	fetchURL.searchParams.append('id', playlistID);
	fetchURL.searchParams.append('part', 'snippet');
	fetchURL.searchParams.append('key', SECRET_YT);

	let headers;
	if (etag) {
		console.log(etag);
		headers = new Headers({
			'If-None-Match': etag
		});
	}

	const res = await fetch(fetchURL, { headers: headers });

	if (res.status == 200) {
		const plresJson = await res.json();
		const plDetails: Omit<IPlaylistData, 'playlistId' | 'videos'> = {
			playlistName: plresJson.items[0].snippet.title,
			playlistThumbnail: plresJson.items[0].snippet.thumbnails.default.url,
			playlistChannel: plresJson.items[0].snippet.channelTitle,
			playlistEtag: plresJson.etag
		};
		return { status: 200, data: plDetails };
	} else if (res.status == 304) {
		return { status: 304, data: null };
	} else {
		return { status: 404, data: null };
	}
};

const fetchVideo = async (videoID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoID}&part=snippet&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};
