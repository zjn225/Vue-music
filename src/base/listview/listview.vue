<template>
  <scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview">
    <!--:listen-scroll表示是否监听滚动事件,probe-type表示scroll事件触发中探针的活跃度或者频率，-->

    <!--歌手列表-->
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <!--这个h2是不同字母歌手之间的分割线-->
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <!--歌手详情页点击事件-->
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!--右侧列表-->
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <!--渲染右侧列表，data-index对应着当前的位置-->
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}"> {{item}}
        </li>
      </ul>
    </div>
    <!--吸顶式导航，显示的是字母-->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <!--loading动画-->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import {getData} from '../../common/js/dom'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18   //上下线之间的，也就是group的距离

  export default {
    props: { //接收来自父组件的数据，如singer.vue里的singers
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      /*右侧列表*/
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      /*顶部固定栏*/
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''  //否则会多出一个顶部栏
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data() {
      return {
        scrollY: -1,  //左右联动的关键变量，滚动条位置
        currentIndex: 0,  //左右联动的关键变量，高亮位置
        diff: -1
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this.touch = {}
      this.listHeight = []
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item) //点击事件纯粹是把事件派发出去，因为listView是个基础组件，不负责业务逻辑
      },

      /*移动端点击事件，相当于click*/
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index') //这个方法会加上前缀data-
        //以下几个数据都是给滑动的时候用的
        let firstTouch = e.touches[0]   //滑动的时候手指刚碰到的位置
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },

      /*手指滑动事件*/
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0  // |0是向下取整，得到偏移了几个锚点
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      //scroll事件
      scroll(pos) {
        this.scrollY = pos.y //这个pos是子组件scroll传递过来的参数
      },
      /*得到的是每个字母group的高度，得到的listHeight是与右侧栏对应的关键*/
      _calculateHeight() {
        this.listHeight = []  //左右联动的关键变量
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)   //group的上限
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },

      /*点击或者滑动的核心方法*/
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index] //令scrollY等于每个group的上限，这个是左右联动的关键，否则高亮不会跟随移动
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        //scroll.vue中的方法，第二个参数是动画时间，通过scrollToElement可以做到点击右侧，滚动到相应的位置
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20) //数据变化到DOM变化有延迟
      },
      /*左右联动的关键max，滚动的时候，scrollY发生变化*/
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {  //计算group的时候多了一个上限
          let height1 = listHeight[i]  //group的下限
          let height2 = listHeight[i + 1] //group的上限
          if (-newY >= height1 && -newY < height2) {
            //手指往上滑即列表向下的时候newY是负值，也就是一开始是0，列表向下newY都是负值
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2  //因为currentIndex是从0开始的，如果从1开始当然是减1
      },
      /*让顶部栏更平滑的移动*/
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

  /*左右联动的关键： 1、实时知道滚动的位置，这里是scrollY，然后根据scrollY得到落在的区间  */

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
