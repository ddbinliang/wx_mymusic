//playing.js
//获取应用实例
const app = getApp();

Page({
  data:{
    // songInfo:'',
    songData:{
      songUrl:'',
      songPic:'',
      songName:'',
      singer:''
    },
    songRankList:'',
    audioIndex:0,
    playStatus: false,
    currentTime:0,
    totalTime:0,
    timer:'',
    newSongList:{},
    sign:1
  },
  onLoad: function () {
    let that = this;
    // let songInfo = app.globalData.songInfo;
    // console.log(songInfo);

    // that.setData({
    //   songInfo: songInfo,
    //   songData:{
    //     songUrl: 'http://ws.stream.qqmusic.qq.com/C100' + songInfo.songmid + '.m4a?fromtag=38',
    //     songPic: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songInfo.albummid + '.jpg',
    //   }
    // });  
    //榜单中详细歌曲列表
    let rankList = app.globalData.songRankList;  //榜单中详细歌曲列表
    let newSongList = app.globalData.newSongList;
    let sign = app.globalData.sign;

    console.log(rankList);
    console.log("榜单中详细歌曲列表");
    that.setData({
      songRankList: rankList,
      newSongList: newSongList,
      sign: sign
    })

    //wx.setStorageSync('audioIndex', rankList.cur_count-1);
    //  获取本地存储在audioIndex的值
    var audioIndexStorage = wx.getStorageSync('audioIndex');
    console.log("音频的Index..." + parseInt(audioIndexStorage));
    console.log(audioIndexStorage);
    if (audioIndexStorage) {
      this.setData({ audioIndex: audioIndexStorage });
    }
    that.play();
  },
  onReady: function () {
    // console.log('playsong onReady');
    // let that = this;
    // that.songPlay();

    // wx.onBackgroundAudioPlay(function () {
    //   console.log('播放了');
    //   that.songPlay();
    // });
  },
  
  //音乐播放进度条
  bindSliderchange: function (e) {
    // clearInterval(this.data.timer)
    let value = e.detail.value
    let that = this
    console.log(e.detail.value)
    //获取后台音乐播放的状态
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        let { status, duration } = res
        if (status === 1 || status === 0) {
          that.setData({
            sliderValue: value
          });
          //控制音乐播放的进度
          wx.seekBackgroundAudio({
            position: value * duration / 100,
          });
        }
      }
    })
  },

  //上一首
  bindPrevSong: function () {
    if (this.data.sign == 0) {
      wx.showToast({
        title: '暂无更多歌曲',
        image: '../../images/warning.png',
        duration: 2000
      })
    } else {
      console.log('上一首歌曲...')
      let length = this.data.songRankList.length;
      let audioIndexPrev = this.data.audioIndex;
      let audioIndexNow = audioIndexPrev;
      if (audioIndexPrev === 0) {
        audioIndexNow = length - 1;
      } else {
        audioIndexNow = audioIndexPrev - 1;
      }
      this.setData({
        audioIndex: audioIndexNow,
        sliderValue: 0,
        currentTime: 0,
        totalTime: 0,
      })
      let that = this
      setTimeout(() => {
        if (that.data.playStatus === true) {
          that.play();
        }
      }, 1000);
      //设置audioIndex 为当前的index
      wx.setStorageSync('audioIndex', audioIndexNow);
    }
  },
  //下一首
  bindNextSong: function () {
    if(this.data.sign ==0){
      wx.showToast({
        title: '暂无更多歌曲',
        image:'../../images/warning.png',
        duration: 2000
      }) 
    }else{
      console.log('下一首歌曲...')
      let length = this.data.songRankList.length;
      let audioIndexPrev = this.data.audioIndex;
      let audioIndexNow = audioIndexPrev;
      if (audioIndexPrev === length - 1) {
        audioIndexNow = 0;
      } else {
        audioIndexNow = audioIndexPrev + 1;
      }
      this.setData({
        audioIndex: audioIndexNow,
        sliderValue: 0,
        currentTime: 0,
        totalTime: 0,
      })
      let that = this
      setTimeout(() => {
        if (that.data.playStatus === false) {
          that.play();
        }
      }, 1000)
      wx.setStorageSync('audioIndex', audioIndexNow);
    }
  },
  //播放 暂停
  bindPlaySong: function () {
    console.log('播放/暂停音乐...');
    console.log(this.data.playStatus);
    if (this.data.playStatus === true) {
      this.play();
      this.setData({ 
        playStatus: false 
      });
    } else {
      wx.pauseBackgroundAudio();
      this.setData({ 
        playStatus: true 
      });
    }
  },
  //播放音乐函数
  play() {
    let that = this;
    let { songRankList, audioIndex } = that.data
    console.log("播放时的数据...")
    console.log(that.data);
    let songId, songPicId, songUrl, songPic,songName,singer;
    if (that.data.sign==0){
      let newSong = that.data.newSongList;
      songUrl = newSong.url;
      songPic = newSong.albumpic_small;
      songName = newSong.songname;
      singer = newSong.singername;
    }else{
      if ("data" in songRankList) {
        let rankFormatOne = songRankList.data[audioIndex];
        songId = rankFormatOne.songmid;
        songPicId = rankFormatOne.albummid;
        songName = rankFormatOne.songname;
        singer = rankFormatOne.singer;
      } else {
        let rankFormatTwo = songRankList[audioIndex].data;
        songId = rankFormatTwo.songmid;
        songPicId = rankFormatTwo.albummid;
        songName = rankFormatTwo.songname;
        singer = rankFormatTwo.singer;
      }
      songUrl = 'http://ws.stream.qqmusic.qq.com/C100' + songId + '.m4a?fromtag=38';
      songPic = 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songPicId + '.jpg';
    }
    that.setData({
      songData: {
        songUrl: songUrl,
        songPic: songPic,
        songName: songName,
        singer: singer
      },
    })

    wx.playBackgroundAudio({
      dataUrl: songUrl,
      title: songName,
      coverImgUrl: songPic
    })
    let timer = setInterval(function () {
      that.setDuration(that)
    }, 1000)
    that.setData({ timer: timer })
  },
  //音乐 时间轴
  setDuration(that) {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        // console.log(res)
        let { status, duration, currentPosition } = res
        if (status === 1 || status === 0) {
          that.setData({
            currentTime: that.stotime(currentPosition),
            totalTime: that.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
        }
      }
    })
  },
  //时间转换
  stotime: function (s) {
    let t = '';
    if (s > -1) {
      // let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      // if (hour < 10) {
      //   t = '0' + hour + ":";
      // } else {
      //   t = hour + ":";
      // }

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec;
    }
    return t;
  },
});