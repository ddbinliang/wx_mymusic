//findMusic.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp();

Page({
  data:{
    inputShow: false,
    inputValue: "",
    navIndex:0,
    navbar:['音乐馆','网络热歌'],
    swiperItem:[
      { id: 0, url: "../../images/banner/01.jpg", },
      { id: 1, url: "../../images/banner/02.jpg", },
      { id: 2, url: "../../images/banner/03.jpg", },
      { id: 3, url: "../../images/banner/04.jpg", },
      { id: 4, url: "../../images/banner/05.jpg", },
      { id: 5, url: "../../images/banner/06.jpg", },
      { id: 6, url: "../../images/banner/07.jpg", },
      { id: 7, url: "../../images/banner/08.jpg", },
      { id: 8, url: "../../images/banner/09.jpg", },
      { id: 9, url: "../../images/banner/10.jpg", }
    ],
    swiperCurrent:0,
    recommend:[],
    topList:[],
    hotSearch:{
      hotkey:[],
      hotname:""
    },
    searchKeyword:"",
    searchResList:[],
    searchPageNum: 1,
    isFromSearch:true,
    searchLoading:false,
    searchComplete:false,
    radioList:[],    //电台
    khotSong:[]
  },
  onLoad: function () {
    var that = this;

    //电台
    util.getMusicRadio(function (data) {
      console.log("电台........");
      console.log(data);
      that.setData({
        radioList: data.data.radioList
      })
    });

    //热门搜索
    util.getHotSearch(function (data) {
      that.setData({
        hotSearch: {
          hotkey: data.data.hotkey,
          hotname: data.data.special_key
        }
      })
    });

    //推荐新歌
    util.getRecommendList(27,function (data) {
      console.log("推荐新歌...");
      let newSong = data.showapi_res_body.pagebean.songlist;
      let songList = newSong.slice(0,9);
      console.log(songList);
      that.setData({
        recommend: songList
      })
    });

    //K歌歌曲
    util.getRecommendList(28, function (data) {
      console.log("K歌...");
      let kSong = data.showapi_res_body.pagebean.songlist;
      let songList = kSong.slice(0, 21);
      console.log(songList);
      that.setData({
        khotSong: songList
      })
    });

    util.getToplist(function (data) {
      console.log("热门榜单...");
      console.log(data);
      that.setData({
        topList: data.data.topList
      })
    });
  },
  //获取搜索的关键词
  bindKeywordInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value,
      searchPageNum: 1,
      isFromSearch: true
    })
  },

  //搜索
  searchSongByWord: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,
        searchPageNum = that.data.searchPageNum;
    util.getSearchMusic(searchKeyword, searchPageNum, function (data) {
      console.log(data)
      if (data.data.song.curnum != 0) {
        let searchList = [];
        that.data.isFromSearch ? searchList = data.data.song.list : searchList = that.data.searchSongList.concat(data.data.song.list)
        that.setData({
          searchResList: searchList,
          searchLoading: true
        });
      } else {
        that.setData({
          searchComplete: true,
          searchLoading: false
        });
      }
    })
  },

  //调用 搜索函数
  keywordSearch: function (e) {
    let that = this;
    that.setData({
      searchKeyword: e.detail.value
    });
    that.searchSongByWord();
  },

  //向下拉动加载更多
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,
        isFromSearch: false
      });
      that.searchSongByWord();
    }
  },

  //热门关键字 直接搜索
  hotkeySearchsong: function (e) {
    let that = this;
    let word = e.currentTarget.dataset.text;
    that.setData({
      searchKeyword: word
    });
    that.searchSongByWord();
  },

  //从列表到播放页面
  playsongTap: function (e) {
    app.setGlobalData({
      songRankList: e.currentTarget.dataset,
      audioIndex: parseInt(e.currentTarget.id, 10)
    });
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10));
    wx.navigateTo({
      url: '../playing/playing'
    });
  },
  //推荐新歌 到播放页面
  newSongPlayTap:function(e){
    console.log("新歌的信息.......");
    console.log(e.currentTarget.dataset.data);
    app.setGlobalData({
      newSongList: e.currentTarget.dataset.data,
      sign: parseInt(e.currentTarget.dataset.sign, 10)
    });
    wx.navigateTo({
      url: '../playing/playing'
    });
  },

  showItem: function () {
    this.setData({
      inputShow: true
    });
  },
  hideItem: function () {
    this.setData({
      inputShow: false,
      inputValue: ""
    });
  },
  clearInput: function () {
    this.setData({
      inputValue: "",
    });
  },
  bindNavTab:function(e){
    this.setData({
      navIndex: e.currentTarget.dataset.index
    });
  },
  bindSwiperChange:function(e){
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  //获取排行榜单的ID
  getSongRankListId:function(e){
    app.setGlobalData({
      songRankListId: e.currentTarget.dataset.id
    });
    wx.navigateTo({
      url: '../musicList/musicList'
    });
  },

});