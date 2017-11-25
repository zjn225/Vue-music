<template>
  <!--这里的ref是引用,方便下面的$ref调用-->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!--注意这个插槽的使用，如果不使用这个，父组件recommend在<slider>标签下无法扩展标签-->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <!--是否绑定active这个class取决于冒号后面的参数-->
      <span class="dot" :class="{active: currentPageIndex === index }"
            v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from '../../common/js/dom'
  import BScroll from 'better-scroll'  //滑动

  export default {
    //非data数据
    name: 'slider',
    //控制轮播的参数，props子组件接受来自父组件的数据
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0  //当前是第几页
      }
    },
    //钩子函数
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      //监听窗口大小事件
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()  //better-scroll的接口
      })
    },
    //钩子函数
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    //钩子函数
    deactivated() {
      clearTimeout(this.timer)
    },
    //钩子函数，tab切换时销毁计时器
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children //获取列表的元素
        //        console.log(this.$refs.sliderGroup)
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth //获取屏幕的横向宽度414
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')  //在dom.js中定义了此方法
          //          console.log(child)  //可以看出720 x 288
          //          以下两句为关键
          child.style.width = sliderWidth + 'px'  //强制将获得的图片数据的尺寸调正常
          width += sliderWidth  //总的宽度 === 所有图片的宽度加起来
        }
        if (this.loop ) { //这部分不随窗口大小改变而变化
          width += 2 * sliderWidth   //加两倍的sliderWidth（就是左右两个屏幕的宽度而已），做到无缝滚动，
        }
        this.$refs.sliderGroup.style.width = width + 'px'  //轮播图的总宽度
      },
      /*初始化Vue的轮播图组件，给予各个参数*/
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        //滚动结束后触发
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            //循环模式下，每次都会把每张图片拷贝一份，所以正确的应该是减1的
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            this._play()
          }
        })

        this.slider.on('beforeScrollStart', () => {
          //getCurrentPage是_initSlider里的
          if (this.autoPlay) {
            clearTimeout(this.timer)  //不让手动拖动和自动轮播起冲突
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1 //因为前面减1了，所以是从0开始的
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
