//musicList.js
var util = require('../../utils/util.js')
//获取应用实例
const app = getApp();

Page({
  data: {
    topInfo: {},
    songList: [],
    updateTime: '',
    listBgColor: '',
    isLight: false
  },
  onLoad: function () {
    console.log('toplist onLoad');

    let that = this;
    let id = app.globalData.songRankListId;
    util.getToplistInfo(id, function (data) {
      if (data.color == '14737632') {
        that.setData({
          isLight: true
        })
      };
      that.setData({
        topInfo: data.topinfo,
        songList: data.songlist,
        updateTime: data.update_time,
        listBgColor: that.dealColor(data.color)
      });
      app.setGlobalData({
        songRankList: data.songlist
      });
    })
  },
  dealColor: function (rgb) {
    if (!rgb) { return; }
    let r = (rgb & 0x00ff0000) >> 16,
      g = (rgb & 0x0000ff00) >> 8,
      b = (rgb & 0x000000ff);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  },
  playsongTap: function (e) {
    app.setGlobalData({
      songInfo: e.currentTarget.dataset.data,
      audioIndex: e.currentTarget.id,
      sign: parseInt(e.currentTarget.dataset.sign, 10)
    });
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10));
    wx.navigateTo({
      url: '../playing/playing'
    });
  }
})