interface IVideoData {
	channelTitle: string;
	title: string;
	videoID: string;
	thumbnailUrl: string;
}

interface IPlaylistData {
	playlistName: string;
	playlistThumbnail: string;
	playlistChannel: string;
	videos: IVideoData[];
}

interface IPlaylistDataResponse {
	success: boolean;
	message: IPlaylistData;
}

type IGroupedVideoData = Array<
	{ isPlayList: true; data: IPlaylistData } | { isPlayList: false; data: IVideoData }
>;
