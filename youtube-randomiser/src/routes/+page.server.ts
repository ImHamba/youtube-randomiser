import { SECRET_YT } from '$env/static/private';
export const actions = {
	getPlaylist: async ({ request }) => {
		const data = await request.formData();
		const playlistID = data.get('ytMediaID')?.toString();

		if (playlistID == null) {
			return { success: false, message: null };
		}

		let res: Response = await fetchPlaylistItems(playlistID);

		if (res.status != 200) {
			return { success: false, message: null };
		}

		const resJson = await res.json();

		const plres = await fetchPlaylistDetails(playlistID);
		const plresJson = await plres.json();
		const plName = plresJson.items[0].snippet.title;
		const plThumbnail = plresJson.items[0].snippet.thumbnails.default.url;
		const plChannel = plresJson.items[0].snippet.channelTitle;

		const videoData: IVideoData[] = resJson.items.map((e: any) => {
			const data = {
				channelTitle: e.snippet.videoOwnerChannelTitle || e.snippet.channelTitle,
				title: e.snippet.title,
				videoID: e.snippet.resourceId.videoId,
				thumbnailUrl: e.snippet.thumbnails.default.url
			};
			console.log(data);
			return data;
		});

		let playlistData: IPlaylistData = {
			playlistName: plName,
			playlistThumbnail: plThumbnail,
			playlistChannel: plChannel,
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

const fetchPlaylistItems = async (playlistID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistID}&part=snippet&maxResults=50&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};

const fetchPlaylistDetails = async (playlistID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/playlists?id=${playlistID}&part=snippet&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};

const fetchVideo = async (videoID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoID}&part=snippet&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};
