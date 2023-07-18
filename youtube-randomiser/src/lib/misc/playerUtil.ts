export const loadVideo = (player: any, videoId: string) => {
	player.loadVideoById(videoId);
	player.seekTo(0);
	player.playVideo();
};

export const getCurrentVideoId = (videoList: IVideoData[], videoIndex: number) => {
	return videoList[videoIndex].videoID || '';
};

export const getCurrentVideoTime = (player: any): number => {
	return player.getCurrentTime();
};

export const getVideoDuration = (player: any): number => {
	return player.getDuration();
};
