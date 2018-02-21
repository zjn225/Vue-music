import storage from 'good-storage'

/*搜索结果相关*/
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

/*播放列表相关*/
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {  //存在，在第一条数据，不用操作
    return
  }
  if (index > 0) {    //存在，在后面，先删、
    arr.splice(index, 1)
  }
  arr.unshift(val)     //插入数组头部
  if (maxLen && arr.length > maxLen) { //不能超过长度
    arr.pop()
  }
}

/*保存搜索记录*/
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}


function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/*删除搜索记录*/
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

/*删除所有历史*/
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

/*加载储存  ---  在state.js中调用*/
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

/*保存播放列表*/
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

/*加载播放列表*/
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

/*个人中心喜欢列表*/
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

