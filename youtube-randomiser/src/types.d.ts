interface IVideoData {
	success: boolean;
	channelTitle: string;
	title: string;
	videoID: string;
	thumbnailUrl: string;
}

interface IPlaylistData {
	success: boolean;
	message: IVideoData[];
}
