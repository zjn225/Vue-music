<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!--确保有recommends数据才渲染，否则mounted时机不对-->
      <!--因为是轮播图和歌单一起滚动，所以整体加个div包裹-->
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <!--把slider组件引入，但是本来是不允许在标签内引入的，所以需要在slider组件加入slot-->
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <!--由于fastClick组件会与原生的click冲突，需要加个class解决-->
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <!--懒加载左侧图片-->
                <!--这里不用配置needsclick是因为参数里就有click-->
                <img v-lazy="item.imgurl" height="60" width="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!--loading-->
      <div class="loading-container" v-show="!discList.length">
          <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from '../../api/recommend.js'
  import Slider from '../../base/slider/slider.vue'
  import {ERR_OK} from '../../api/config'
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'

  export default {
    data() {
      return {
        recommends: [],  //存储轮播图图片
        discList: [],
      }
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) { //语义化，其实ERR_OK就是为0
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      /*监听轮播图图片是否出来再refresh计算高度，因为轮播图的高度是靠它撑开的，否则better-scroll高度不正确*/
      /*注意这里的使用技巧：仅调用一次*/
      loadImage() {
        if (!this.checkloaded) {
          this.$refs.scroll.refresh()
          this.checkloaded = true;
        }
      }

    },

    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
              /*loading样式*/
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

