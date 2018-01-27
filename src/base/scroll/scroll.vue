<!--滚动条组件-->
<template>
  <div ref="wrapper">
    <slot></slot>
    <!--目的是为了在父组件引用的时候能在<scroll>标签内自由加内容-->
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      //子组件要显式地用 props 选项声明它预期的数据：
      //父组件要使用的数据，比如<scroll :data="xxx">，这个data就是这里props声明的，xxx是父组件里data的
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }

        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
            //点击事件纯粹是把事件派发出去，因为scroll是个基础组件，不负责业务逻辑
            //用的时候:scroll="方法名"，参数是pos
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {   //这里之所以监听data变化（data是recommend.vue传过来的）是因为歌单和轮播图的数据是会变化的
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
