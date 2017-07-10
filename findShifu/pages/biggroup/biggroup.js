var base64 = require("../..//images/base64");
Page({
  data: {
    inputValue: '',
    session: '',
    userinfo: {},
    iscommend: false,
    isShifu:false,
    commentval:'',
  },
  playVoice: function (e) {
    wx.playVoice({
      filePath: e.currentTarget.dataset.talk,
      complete: function () {
      }
    })
  },
  showPhoto: function (e) {
    var that = this
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.id]
    })
  },
  bindToComment: function () {
    wx.navigateTo({
      url: '/pages/biggroupcomment/biggroupcomment',
    })
  },
  bindToQA: function () {
    wx.navigateTo({
      url: '/pages/biggroupqa/biggroupqa',
    })
  },
  bindChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  btnSearch: function () {
    if (this.data.inputValue != null && this.data.inputValue.trim() !== '') {
      this.setData({
        iscommend: false,
        inputValue: ''
      })
    }

  },
  bindComment: function (e) {
    wx.navigateTo({
      url: '/pages/privatelyhim/privatelyhim',
    })
  },
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
  },
})