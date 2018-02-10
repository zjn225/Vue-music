<template>
  <Scroll ref="suggest"
          class="suggest"
          :data="result"
          @scrollToEnd="searchMore"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" @click="selectItem(item)">
        <!--左侧图标-->
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <!--右侧结果-->
        <div class="name">
          <p class="text" v-html="getDisplayName(item,index)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>

  </Scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'
  import {search} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  import Loading from '../../base/loading/loading'
  import Singer from '../../common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from '../../base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20   //每一页的个数

  export default {
    props: {
      showSinger: {   //是否展示歌手
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        page: 1,   //第几页
        pullup: true,  //下拉加载更多，scroll组件里有定义
        beforeScroll: true,
        hasMore: true, //是否有更多数据
        result: []  //搜索结果
      }
    },
    methods: {
      search() {
        this.hasMore = true
        //防止有下拉刷新的时候，修改query不返回搜索顶部
        this.$refs.suggest.scrollTo(0, 0)
        this.page = 1
        //search.js里的方法
        search(this.query, this.page, this.showSinger,perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)   //看看结果是否还有剩余，决定hasMore值（默认为true）
          }
        })
      },

      /*格式化1*/
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {  //搜索结果含有含歌手
          // console.log({...data.zhida})
          // console.log({...{type: TYPE_SINGER}})
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})  //拼接zhida对象+自定义的type对象
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },

      /*格式化2*/
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },

      /*搜索结左边的icon*/
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },

      /*搜索结果展示*/
      getDisplayName(item,index) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
          //本来是没有singer的，normalize之后就有了
        }
      },

      /*有下拉动作时下拉刷新*/
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++ //加载下一页
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)//是否还有剩余
          }
        })
      },

      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },

      /*点击*/
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        //存储历史记录
        this.$emit('select', item)
      },

      /*滚动之前，手机键盘会出来*/
      listScroll() {
        this.$emit('listScroll')
      },

      refresh(){
        this.$refs.suggest.refresh()
      },

      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),

      ...mapActions([
        'insertSong'
      ])

    },
    watch: {
      query() {
        this.search()
      },
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
