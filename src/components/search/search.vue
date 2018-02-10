<template>
  <div class="search">
    <!--搜索框-->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!--热门搜索，搜索框有文字时show为false-->
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <!--根据关键字+搜索历史 计算scroll高度来滚动-->
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!--搜索结果-->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @listenScroll="blurInput" :query="query" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"
             @confirm="clearSearchHistory">
    </confirm>
    <!--singerDetail组件-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '../../base/search-box/search-box'
  import SearchList from '../../base/search-list/search-list'
  import Scroll from '../../base/scroll/scroll'
  import Confirm from '../../base/confirm/confirm'
  import Suggest from '../../components/suggest/suggest'
  import {getHotKey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    mixins: [playlistMixin],   //插入mixin，merge它方法，可以理解mixin是java里的接口要实现它
    data() {
      return {
        hotKey: [],
        query: '',
      }
    },

    computed: {
      /*由于scroll等于两部分加起来，当一部分发生变化时保证整体高度正确计算*/
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      },

      ...mapGetters([
        'searchHistory'
      ])
    },

    created() {
      this._getHotKey()
    },

    methods: {
      /*点击后添加到搜索框*/
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)  //search-box里的方法
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },

      /*搜索框输入文字时，首先@query是search-box.vue里watch到query变化后emit过来的方法，
      目的是获得让父组件也就是search.vue获得search-box里的query*/

      /*search.vue也就是本组件获得query后，传递给了子组件suggest.vue*/
      onQueryChange(query) {
        this.query = query
      },

      /*获取热门搜索关键字*/
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },

      /*blur出去是让手机键盘出来*/
      blurInput() {
        this.$refs.searchBox.blur()   //这个blur方法又是子组件search-box上的方法
      },

      saveSearch() {
        this.saveSearchHistory(this.query)
      },

      /*这些可以不用代理起来，直接写在@click里，因为mapActions里相当于写在了methods里了*/
      /*   deleteOne(item){
           this.deleteSearchHistory(item);
         },

         deleteAll(){
           this.clearSearchHistory()
         },*/
      showConfirm() {
        this.$refs.confirm.show()
      },

      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])

    },

    watch: {
      /*刷新scroll组件，防止从输入框输完后，scroll部分不能滚动的问题*/
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          })
        }
      },
    },

    components: {
      SearchBox,
      Suggest,
      Scroll,
      SearchList,
      Confirm
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
