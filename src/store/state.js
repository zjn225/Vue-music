import {playMode} from '../common/js/config'
import {loadSearch,loadPlay,loadFavorite} from '../common/js/cache'

const state = {
  singer: {},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[], //顺序播放时的列表
  mode:playMode.sequence,
  currentIndex:-1,  //当前播放
  disc: {},
  topList:{},
  searchHistory:loadSearch(),  //搜索历史，从搜索缓存里读取
  playHistory:loadPlay(),  //add-song里使用的播放历史
  favoriteList:loadFavorite(),
}

export default state
