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
	playlistEtag: string;
	playlistId: string;
	videos: IVideoData[];
}

type IPlaylistDataResponse =
	| {
			success: true;
			status: 200;
			message: IPlaylistData;
	  }
	| {
			success: false;
			status: 404;
			message: null;
	  }
	| {
			success: true;
			status: 304;
			message: null;
	  };

type IGroupedVideoData = Array<IVideoGroup>;

type IVideoGroup =
	| { isPlayList: true; data: IPlaylistData }
	| { isPlayList: false; data: IVideoData };
