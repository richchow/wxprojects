var app = getApp()
Page({
  data: {
    text: '',
    title: '',
    userInfo: {},
    message: [{ id: '', text: 'huihuihiuhuihiuhiu', me: true, img: '/images/robot1.png' }, { id: '', text: 'sdfsafdadf', me: false, img: '/images/robot1.png' }],
    inputValue: '',
    messageID: 2,
    intoView: ''
  },
  onReady: function () {
    console.log('onReady')
    this.setData({
      intoView: 'message' + this.data.messageID
    })
  },
  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    app.getDataList(function (item) {
      console.log(item)
      that.setData({
        message: item,
        messageID: item.length,
        intoView: 'message' + (item.length - 1)
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找答案',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  btnSearch: function () {
    if (this.data.inputValue != null && this.data.inputValue.trim() !== '') {
      let msgID = this.data.messageID + 1;
      let currentdata = this.data.message;

      let data = {
        id: 'message' + msgID,
        img: this.data.userInfo.avatarUrl,
        me: true,
        text: this.data.inputValue
      }
      currentdata.push(data)
      app.setDataList(data)
      this.setData({
        inputValue: "",
        message: currentdata,
        messageID: msgID
      })
    }
    this.setData({
      intoView: 'message' + this.data.messageID
    })
  }
})