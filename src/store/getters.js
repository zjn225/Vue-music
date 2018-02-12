/*歌手*/
/*歌手*/
export const singer = state => state.singer

/*播放器*/
export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

/*歌单详情页*/
export const disc = state => state.disc

/*排行榜*/
export const topList = state => state.topList

/*搜索历史*/
export const searchHistory = state => state.searchHistory

/*add-song里使用的播放历史*/
export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList
