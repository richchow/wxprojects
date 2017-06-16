var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    showLoading: false,
    isPayed: false,
    isPaying: false,
    bottomleftBtn: 'bottomleftBtn',
    bottomleftPayingBtn: 'bottomleftPayingBtn',
    session: '',
    animationData: {},
    showModalStatus: false,
    showShareModalStatus: false,
    userinfo: {},
    datainfo: {},
  },

  pay: function (e, res) {
    var that = this
    if (that.data.isPaying === false) {
      that.setData({
        isPaying: true
      })
      payService.pay(this.data.datainfo.dataid, this.data.session, function (item) {
        if (item.RetCode == 0) {
          that.setData({
            isPayed: true
          })
          wx.navigateTo({
            url: '/pages/payed/payed'
          })
        } else if (item.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal("支付失败！请重试");
        }
        that.setData({
          isPaying: false
        })
      })
    }
  },
  bindToPayed: function (e) {
    wx.navigateTo({
      url: '/pages/payed/payed'
    })
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
      showShareModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        showShareModalStatus: false
      })
    }.bind(this), 2000)
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
        showShareModalStatus: false
      })
    }.bind(this), 200)
  },
  onShareAppMessage: function () {
    return {
      title: this.data.datainfo.title + ' - BIM找资料',
      path: '/pages/detail/detail?id=' + this.data.datainfo.dataid
    }
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      showLoading: true
    })

    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })

      app.getUserInfo(function (userInfo) {
        that.setData({
          userInfo: userInfo
        })
      })

      //获得内容详情
      dataService.getDataInfo(options.id, session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            datainfo: items.data[0]
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        if (that.data.datainfo.Buyed == 0) {
          that.setData({
            isPayed: true
          })
        }
        setTimeout(function () {
          that.setData({
            showLoading: false
          });
        }, 2000)
      })
    })


  }
})