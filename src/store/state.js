import {playMode} from '../common/js/config'

const state = {
  singer: {},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[], //顺序播放时的列表
  mode:playMode.sequence,
  currentIndex:-1,  //当前播放
  disc: {},
}

export default state
