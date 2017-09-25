var app = getApp()
var dataService = require('../../providers/dataService')
var inttime
Page({
  data: {
    hastalked: false,
    loading: false,
    tempimg: [],
    temptalk: '',
    tempvideo: '',
    succesimg: '',
    succestalk: '',
    succesvideo: '',
    videonum: 0,
    imgnum: 0,
    userinfo: {},
    session: '',
    talkmsg: '点击开始录音',
    talkStatus: false,
    talktime: 1,
    masterid: '',
  },
  formSubmit: function (e) {
    this.setData({
      loading: true
    })
    var err = true
    var that = this
    if (e.detail.value.content != '' || that.data.succestalk != '') {
      err = false
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else {
      let files = that.data.succesimg + that.data.succestalk + that.data.succesvideo
      files = files.length > 0 ? files.substring(0, files.lastIndexOf('|')) : files

      dataService.PushMessage(that.data.session, that.data.masterid, files, e.detail.value.content, function (items) {
        if (items.RetCode == 0) {
          if (e.detail.formId != undefined && e.detail.formId != 'the formId is a mock one') {
            dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
          }
          wx.navigateBack({
            delta: 1
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          loading: false
        })
      })
    }
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
        dataService.MessagePushFiles(that.data.session, Number('3' + time), that.data.succestalk, new Array(res.tempFilePath), 0, 1, function (item) {
          if (item.RetCode == 0) {
            that.setData({
              succestalk: item.data,
              temptalk: temp,
              hastalked: true,
            })
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }
        })
      },
      fail: function (res) {
        //录音失败
        app.showModal("数据错误，请稍后重试");
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
  delVoice: function (e) {
    var that = this
    dataService.MessageDelFiles(that.data.session, e.currentTarget.dataset.url, function (item) {
      if (item.RetCode == 0) {
        that.setData({
          succestalk: '',
          temptalk: '',
          hastalked: false,
          talkmsg: '点击开始录音',
        })
      }
    })
  },
  bindbtnBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      masterid: options.masterid
    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
})