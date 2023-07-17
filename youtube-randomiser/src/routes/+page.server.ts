import { SECRET_YT } from '$env/static/private';
export const actions = {
	getPlaylist: async ({ request }) => {
		const data = await request.formData();
		const playlistID = data.get('ytMediaID')?.toString();

		if (playlistID == null) {
			return { success: false, message: null };
		}

		let firstPlJson = await fetchPlaylistItems(playlistID);
		let allSnippets = firstPlJson.items;

		const numAddlRequests = Math.max(
			3,
			Math.ceil(firstPlJson.pageInfo.totalResults / firstPlJson.pageInfo.resultsPerPage) - 1
		);

		if (numAddlRequests > 0) {
			let nextPageToken = firstPlJson.nextPageToken;

			for (let i = 0; i < numAddlRequests; i++) {
				let nextPageJson = await fetchPlaylistItems(playlistID, nextPageToken);
				allSnippets = [...allSnippets, ...nextPageJson.items];
				nextPageToken = nextPageJson?.nextPageToken;
			}
		}

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
			.filter((e: any) => e !== undefined);

		const plDetails = await fetchPlaylistDetails(playlistID);
		let playlistData: IPlaylistData = {
			...plDetails,
			videos: videoData
		};

		return { success: true, message: playlistData };
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
	const fetchURL =
		`https://youtube.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistID}&part=snippet&maxResults=50&key=${SECRET_YT}` +
		(nextPageToken ? `&pageToken=${nextPageToken}` : '');

	const res = await fetch(fetchURL);

	if (res.status != 200) {
		return [];
	}

	const resJson = await res.json();
	return resJson;
};

const fetchPlaylistDetails = async (playlistID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/playlists?id=${playlistID}&part=snippet&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	const plresJson = await res.json();
	const plName = plresJson.items[0].snippet.title;
	const plThumbnail = plresJson.items[0].snippet.thumbnails.default.url;
	const plChannel = plresJson.items[0].snippet.channelTitle;

	return {
		playlistName: plName,
		playlistThumbnail: plThumbnail,
		playlistChannel: plChannel
	};
};

const fetchVideo = async (videoID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoID}&part=snippet&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};
