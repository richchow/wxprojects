var app = getApp()
var inttime
Page({
  data: {
    hastalked: false,
    loading: false,
    temptalk: '',
    userinfo: {},
    session: '',
    talkmsg: '点击开始录音',
    talkStatus: false,
    talktime: 1,
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
  bindTalk: function () {
    var that = this
    that.setData({
      talkStatus: true
    })
    var time = 1
    inttime = setInterval(function () {
      that.setData({
        talkmsg: '录音中 ' + time + '"',
        talktime: time,
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
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
})