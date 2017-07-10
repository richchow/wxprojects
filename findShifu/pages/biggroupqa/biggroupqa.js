var app = getApp()
var inttime
Page({
  data: {
    hastalked: false,
    loading: false,
    tempimg: [],
    temptalk: '',
    tempvideo: '',
    videonum: 0,
    imgnum: 0,
    userinfo: {},
    session: '',
    talkmsg: '点击开始录音',
    talkStatus: false,
    talktime:1,
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      loading: true
    })
    var err = true
    var that = this
    if (e.detail.value.content === '') {
      err = false
    }
    if (this.data.tempimg.length == 0) {
      err = false
    }
    if (this.data.temptalk === '') {
      err = false
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else { }
  },
  updateVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          tempvideo: res.tempFilePath,
          videonum: 1
        })
      }
    })
  },
  delVideo: function () {
    this.setData({
      tempvideo: '',
      videonum: 0
    })
  },
  bindTalk: function () {
    var that = this
    that.setData({
      talkStatus: true
    })
    var time = 1
    inttime = setInterval(function () { 
      that.setData({
        talkmsg: '录音中 '+time+'"',
        talktime:time,
      })
      time++ 
      }, 1000)
    wx.startRecord({
      success: function (res) {
        let temp = res.tempFilePath
        that.setData({
          temptalk: temp,
          hastalked: true,
        })

      },
      fail: function (res) {
        //录音失败
      }
    })
  },
  bindOverTalk: function () {
    var that = this
    that.setData({
      talkStatus: false,
      hastalked: true,
      talkmsg: '时长： ' + that.data.talktime + '"'
    })
    clearInterval(inttime)
    wx.stopRecord()
  },
  playVoice: function (e) {
    wx.playVoice({
      filePath: e.currentTarget.dataset.talk,
      complete: function () {
      }
    })
  },
  delVoice: function () {
    this.setData({
      temptalk: '',
      hastalked: false,
      talkmsg: '点击开始录音',
    })
  },
  showPhoto: function (e) {
    var that = this
    let temp = []
    for (let i = 0; i < that.data.tempimg.length; i++) {
      temp.push(that.data.tempimg[i].url)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: temp
    })
  },
  delPhoto: function (e) {
    let num = Number(e.currentTarget.dataset.num)
    let timg = this.data.tempimg
    timg.splice(num, 1)
    this.setData({
      tempimg: timg,
      imgnum: this.data.imgnum--,
    })
  },
  updatePhoto: function (e) {
    var that = this
    wx.chooseImage({
      success: function (res) {
        let num = that.data.imgnum;
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          num++;
          if (num <= 9) {
            let currentdata = that.data.tempimg;
            let data = {
              url: res.tempFilePaths[i]
            }
            currentdata.push(data)
            that.setData({
              tempimg: currentdata,
              imgnum: num
            })
          }
        }
      }
    })
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
})