<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <!--歌手详情页singer-detail渲染，这里是通过路由引进来的，而不是组件-->
    <!--至于为什么这里能通过router-view引进来,那是在router.js里设置的-->
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer.js'
  import {ERR_OK} from '../../api/config.js'
  import Singer from '../../common/js/singer.js' //singer构造器
  import ListView from '../../base/listview/listview.vue'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playlistMixin],   //插入mixin，merge它方法，可以理解mixin是java里的接口要实现它
    data() {
      return {
        singers: []
      }
    },

    created() {
      this._getSingerList()
    },

    methods: {
      /*解决了底部mini播放窗口占有滚动 的 高度的问题*/
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },

      selectSinger(item) {
//        console.log(item)
        this.$router.push({
          path: `/singer/${item.id}`  //编程时导航，这里的id在router里的index.js是有配置的
        })
        this.setSinger(item) //this.$store.commit('SET_SINGER')
        //把点击的当前歌手提交保存在vuex
      },

      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      /*核心，因为getSingerList中返回的数据res是所有歌声的信息，而我们想要的是按字母排列的*/
      _normalizeSinger(list) {
        let map = {    //map对象包括hot、key属性，
          hot: {
            title: HOT_NAME,  //title就是侧栏显示的东西，这里为热门
            items: []
          }
        }
        //console.log(list)

        /*获得map  热门+A-Z*/
        list.forEach((item, index) => {
          /*小于10则是热门*/
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          /*这里的Findex是姓氏字母,为A-Z*/
          const key = item.Findex
          //这里的if是必须要加的，因为一开始的map只有hot对象，因为没有key（title），所以放在后面来添加
          if (!map[key]) {  //这里的map[key]就是A-Z包含的歌手集合
            map[key] = {
              title: key, //title就是侧栏显示的东西，这里为A-Z
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })

        // 为了得到有序列表，我们需要处理 map
        //处理后的好处，1、有序 2、hot和ret分开
        let ret = [] //A-Z
        let hot = [] //热门
        for (let key in map) {
          let val = map[key] //A-Z的集合
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },

      /*扩展运算符，调用语法糖mapMutations，映射成一个方法setSinger*/
      ...mapMutations({
        setSinger:'SET_SINGER'// 将 this.setSinger()映射为this.$store.commit('SET_SINGER')
      })
    },

    mounted(){

  },
    components: {
      ListView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /*固定父容器的高度，以便进行滚动*/
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
