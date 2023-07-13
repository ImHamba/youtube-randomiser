import { SECRET_YT } from '$env/static/private';
export const actions = {
	getVideoList: async ({ request }) => {
		const data = await request.formData();
		const ytMediaID = data.get('ytMediaID')?.toString();

		if (ytMediaID == null) {
			return { success: false, message: null };
		}

		let res: Response;
		if (ytMediaID.startsWith('PL')) {
			res = await fetchPlaylist(ytMediaID);
		} else {
			res = await fetchVideo(ytMediaID);
		}

		if (res.status != 200) {
			return { success: false, message: null };
		}
		const resJson = await res.json();

		const playlistData = resJson.items.map((e: any) => {
			return {
				channelTitle: e.snippet.videoOwnerChannelTitle || e.snippet.channelTitle,
				title: e.snippet.title,
				videoID: e.snippet.videoId || ytMediaID,
				thumbnailUrl: e.snippet.thumbnails.default.url
			};
		});

		// console.log(playlistData);

		console.log('Returning data');
		return { success: true, message: playlistData };
	}
};

const fetchPlaylist = async (playlistID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistID}&part=snippet&maxResults=50&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};

const fetchVideo = async (videoID: string) => {
	const fetchURL = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoID}&part=snippet&key=${SECRET_YT}`;

	const res = await fetch(fetchURL);

	return res;
};
