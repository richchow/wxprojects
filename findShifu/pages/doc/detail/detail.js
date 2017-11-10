var app = getApp()
var docService = require('../../../providers/docService')
var payService = require('../../../providers/payService.js')
Page({
  data: {
    showLoading: false,
    showModalUrlStatus: false,
    showShareModalStatus: false,
    isPaying:false,
    isPayed:false,
    session: '',
    userInfo: {},
    datainfo: {},
    masterid:'',
  },
  bindToShifu: function (e) {
    app.setBBflush(true)
    wx.navigateTo({
      url: '/pages/shifu/shifu?id=' + e.currentTarget.dataset.masterid,
    })
  },
  bindToVIP: function () {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
  bindFollow: function (e) {
    var that = this
    let val = e.currentTarget.dataset.val
    wx.setClipboardData({
      data: val,
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '已把地址和提取码复制到剪切板',
          showCancel: false,
        })
      }
    })
  },
  pay: function (e) {
    var that = this
    if (that.data.isPayed) {
      that.setData({
        showModalUrlStatus: true
      })
    } else if (that.data.isPaying === false) {
      that.setData({
        isPaying: true
      })
      payService.PayforMD(that.data.session, that.data.datainfo.dataid, function (item) {
        if (item.RetCode == 0) {
          that.setData({
            isPayed: true,
            showModalUrlStatus: true
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
      showModalUrlStatus: true,
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
        showModalUrlStatus: false,
      })
    }.bind(this), 200)
  },
  showModal2: function () {
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
  hideModal2: function () {
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
  onLoad: function (options) {
    var that = this
    that.setData({
      showLoading: true,
      id: options.id,
      masterid: options.masterid,
    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
      docService.getMasterDatum(that.data.session, that.data.masterid, that.data.id, function (ditems) {
        if (ditems.RetCode == 0) {
          that.setData({
            datainfo: ditems.data[0],
            isPayed: ditems.data[0].isBuyed == 0 || ditems.data[0].amount == 0  ? true : false
          })
        }
      })
      that.setData({
        showLoading: false
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: this.data.datainfo.title + ' - BIM找师傅',
      path: '/pages/doc/detail/detail?masterid=' + this.data.masterid +'&id=' + this.data.datainfo.dataid,
      success: function (res) {
        // 分享成功
      }
    }
  },
})