<template>
  <div class="music-list">
    <!--返回icon-->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!--歌手名字-->
    <h1 class="title" v-html="title"></h1>
    <!--歌手写真-->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!--随机播放全部的按钮-->
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!--蒙版层，高斯模糊，见blur变量-->
      <div class="filter" ref="filter"></div>
    </div>
    <!--layer层，当向下滑动的时候就能看出具体了-->
    <div class="bg-layer" ref="layer"></div>
    <!--Scroll组件,注意这里所有的songs都是父组件singer-detail传过来的-->
    <scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <!--SongList组件-->
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <!--loading-->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import SongList from '../../base/song-list/song-list'
  import {prefixStyle} from '../../common/js/dom'
   import {playlistMixin} from '../../common/js/mixin'
   import {mapActions} from 'vuex'

  const RESERVED_HEIGHT = 40  //预留高度
  //自动加浏览器的前缀
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
   mixins: [playlistMixin],   //插入mixin，merge它方法，可以理解mixin是java里的接口要实现它

    /*这些参数都是父组件要传过来在本组件使用的，scroll、song-list这些参数是在他们相应的组件内定义的
    * 当然值都是singer-detail传过来的*/
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0, //纵向滚动的值
        imageHeight: ''
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    /*初始化scroll参数*/
    created() {
      this.probeType = 3
      this.listenScroll = true  //监听滚动
    },
    mounted() {
      /*设置图片高度*/
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
      /*滑过一屏之后的遮罩层的滚动距离，加40是因为滑动的时候顶部始终要留40px的高*/
      this.defaultLayerY = -this.imageHeight + RESERVED_HEIGHT //-263+40=-223
    },
    methods: {
      /*解决了底部mini播放窗口占有滚动 的 高度的问题*/
      handlePlaylist(playlist) {   //mixin里的方法
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      /*监听滚动事件，获取scrollY的值*/
      scroll(pos) {
        this.scrollY = pos.y //从0开始到负无穷
//        console.log('scrollY：' + this.scrollY)
      },
      back() {
        this.$router.back()
      },

      /*点击某一首音乐*/
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },

      random() {
        this.randomPlay({
          list: this.songs
        })
      },
        ...mapActions([
          'selectPlay',  //和mutation的调用差不多，只不过action的commit是写在了vuex的action文件里
          'randomPlay'
        ])
    },
    watch: {
      scrollY(newVal) {
        //遮罩层的的滚动距离,-223和newVal，显然一开始都是newVal大，后来就是minT最大了，从而限制了最上面留一个高度
        let layerY = Math.max(this.defaultLayerY, newVal)
//        console.log(this.defaultLayerY,newVal)
        let scale = 1  //图片的缩放比例
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / this.imageHeight)

        /*开始设置z-index和blur，只分大于0和小于0，所以分开写了*/

        if (newVal > 0) { //大于0的时候即已经是最上面了，还要向上滑动
          scale = 1 + percent
          zIndex = 10  //保证放大后的图片能全部显示出来
        } else {
          blur = Math.min(20, percent * 20)
        }

        /*当scrollY产生变化时，layer层执行以下动画*/
        this.$refs.layer.style[transform] = `translate3d(0,${layerY}px,0)` //遮罩层Y轴向上移动
        this.$refs.filter.style[backdrop] = `blur(${blur}px)` //css3中的高斯模糊

//        console.log('newVal为：' + newVal, 'defaultLayerY为：' + this.defaultLayerY)

        if (newVal < this.defaultLayerY) {  //第一屏过了
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else { //还在第一屏
          this.$refs.bgImage.style.paddingTop = '70%' //刚开始的状态以及滑动时还没过第一屏
          this.$refs.playBtn.style.display = '';
          this.$refs.bgImage.style.height = 0
        }
        /*scrollY变化时设置scale和zIndex*/
        this.$refs.bgImage.style[transform] = `scale(${scale})` //最顶部仍然往上拉产生缩放特效
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      Scroll,
      Loading,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: layerY(-50%)
</style>
