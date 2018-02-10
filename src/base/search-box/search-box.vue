<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from '../../common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: '',    //v-model双向绑定
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      /*设置参数*/
      setQuery(query) {
        this.query = query
      },
      /*滚动之前，键盘来的时候*/
      blur() {
        this.$refs.query.blur()
      }
    },
    created() {
      /*搜索框query出现变化*/
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)  //父组件使用@quert="xxx"
      }, 500))  //延迟执行！节省流量，输入后稍等一下再请求，方法为util里自定义的debounce
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
