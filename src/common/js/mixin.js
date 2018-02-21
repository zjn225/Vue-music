import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from '../../common/js/config'
import {shuffle} from '../../common/js/util'

/*避免player播放器造成的高度问题——所有组件公用*/
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)   //函数的定义在调用处
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

/*播放——playlist+player公用*/
export const playerMixin = {
  computed: {
    /*播放状态icon*/
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },

  methods: {
    /*改变循环模式*/
    changeMode() {
      const mode = (this.mode + 1) % 3
      console.log(this.mode)
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },

    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      })
      this.setCurrentIndex(index);
    },
    /*切换喜欢/不喜欢*/
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    /*获取个人中心喜欢列表*/
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    /*是否喜欢*/
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

/*搜索——search-box+add-song公用*/
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    /*search.vue也就是本组件获得query后，传递给了子组件suggest.vue*/
    onQueryChange(query) {
      this.query = query
    },

    /*blur出去是让手机键盘出来*/
    blurInput() {
      this.$refs.searchBox.blur()   //这个blur方法又是子组件search-box上的方法
    },

    saveSearch() {
      this.saveSearchHistory(this.query)
    },

    /*点击后添加到搜索框*/
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)  //search-box里的方法
    },

    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
