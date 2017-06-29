// pages/passkey/passkey.js
Page({
  data: {
    id: '',
    isInput: true,
    v1: '',
    v2: '',
    v3: '',
    v4: '',
  },
  bindInput: function (e) {
    this.setData({ isInput: true })
  },
  bindKeyInput: function (e) {
    var val = e.detail.value
    if (val.length == 4) {

      wx.navigateTo({
        url: '/pages/biggroup/biggroup?id='+this.data.id,
      })
    }
    this.setData({
      v1: val.charAt(0),
      v2: val.charAt(1),
      v3: val.charAt(2),
      v4: val.charAt(3),
    })
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
})