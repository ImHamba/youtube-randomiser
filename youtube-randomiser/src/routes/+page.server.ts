import { SECRET_YT } from '$env/static/private';
export const actions = {
	getPlaylist: async ({ request }) => {
		const data = await request.formData();

		const playlistID = data.get('playlistID');

		const fetchURL = `https://youtube.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistID}&part=snippet&maxResults=50&key=${SECRET_YT}`;

		const res = await fetch(fetchURL);

		const resJson = await res.json();

		const playlistData = resJson.items.map((e: any) => {
			return {
				channelTitle: e.snippet.videoOwnerChannelTitle,
				title: e.snippet.title,
				videoID: e.snippet.videoId,
				thumbnailUrl: e.snippet.thumbnails.default.url
			};
		});

		// console.log(playlistData);

		console.log('Returning data');
		return { success: true, message: playlistData };
	}
};
