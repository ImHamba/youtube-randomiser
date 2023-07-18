export const loadVideo = (player: any, videoId: string) => {
	player.loadVideoById(videoId);
	player.seekTo(0);
	player.playVideo();
};

export const getCurrentVideoId = (videoList: IVideoData[], videoIndex: number) => {
	return videoList[videoIndex].videoID || '';
};
