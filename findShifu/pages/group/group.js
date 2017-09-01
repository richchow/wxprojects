var app = getApp()
var dataService = require('../../providers/dataService')
var subRoomService = require('../../providers/subRoomService.js')
var requesttime
Page({
  data: {
    groupitems: [],
    qrbtnstatus: false,
    loading: false,
    showModalStatus: false,
    inputTitle: '',
    animationData: {},
    numVail: 'inputClass',
    chatid: 0,
    showLoading:true,
  },
  bindToFind:function(e){
    wx.switchTab({
      url: '/pages/find/find',
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      loading: true
    })
    var err = false
    var that = this
    if (e.detail.value.num === '' || Number(e.detail.value.num) < 1) {
      err = true
      this.setData({
        numVail: "input-error"
      })
    } else {
      this.setData({
        numVail: "inputClass"
      })
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else {
      subRoomService.makeorder(that.data.session, Number(e.detail.value.num), e.detail.value.name, that.data.chatid, function (items) {
        if (items.RetCode == 0) {
          dataService.getMasterCard(that.data.session, function (item) {
            if (item.RetCode == 0) {
              wx.downloadFile({
                url: that.data.cardurl + item.data[0],
                success: function (res) {
                  wx.previewImage({
                    current: res.tempFilePath,
                    urls: [res.tempFilePath]
                  })
                }
              })
            }
          })
          that.hideModal()
        }
      })
    }
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        qrbtnstatus: false,
        loading: false,
      })
    }.bind(this), 200)
  },
  bindToChat: function (e) {
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + e.currentTarget.dataset.id,
    })
  },
  bindToCreateChat: function () {
    wx.navigateTo({
      url: '/pages/createchat/createchat',
    })
  },
  btnQRCode: function (e) {
    this.setData({
      qrbtnstatus: true,
      showModalStatus: true,
      inputTitle: e.currentTarget.dataset.title,
      chatid: e.currentTarget.dataset.chatid,
      isShifu: false,
    })
  },
  onShow: function () {
    var that = this
    this.setData({
      showLoading: true,

    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      subRoomService.MasterCheck(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            isShifu: (items.data != null && items.data[0].length >0) ? true : false,
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
      })
      subRoomService.SRoomListAll(that.data.session, function (items) {
        if (items.RetCode == 0) {
          for (let i in items.data) {
            if (items.data[i].masterPic != null && items.data[i].masterPic.indexOf('http') < 0) {
              items.data[i].masterPic = app.getRequestUrl() + 'MpicData/' + items.data[i].masterid + '/' + items.data[i].masterPic
            }
          }
          that.setData({
            groupitems: items.data,
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          showLoading: false
        })
      })
    })
    requesttime = setInterval(function () {
      subRoomService.SRoomListAll(that.data.session, function (items) {
        if (items.RetCode == 0) {
          for (let i in items.data) {
            if (items.data[i].masterPic && items.data[i].masterPic.indexOf('http') < 0) {
              items.data[i].masterPic = app.getRequestUrl() + 'MpicData/' + items.data[i].masterid + '/' + items.data[i].masterPic
            }
          }
          that.setData({
            groupitems: items.data,
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
      })
    }, 10000)
  },
  onLoad: function (options) {

  },
  onHide: function () {
    clearInterval(requesttime)
  },
  onUnload: function () {
    clearInterval(requesttime)
  },
  onReady: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
    })
  },
})