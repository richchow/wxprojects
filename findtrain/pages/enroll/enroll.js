//index.js
//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService.js')
var payService = require('../../providers/payService.js')
Page({
  data: {
    session: '',
    showLoading:false,
    animationData: {},
    showModalStatus: false,
    showShareModalStatus: false,
    userInfo: {},
    enrollInfo: {}
  },
  gotoEnrollDetail: function () {
    wx.navigateTo({
      url: '/pages/enrolldetail/enrolldetail',
    })
  },
  pay: function (e) {
    var that = this
    if (e.currentTarget.dataset.buyed == -1) {
      console.log(e.currentTarget.dataset.id)
      payService.pay(e.currentTarget.dataset.id, that.data.session, function (item) {
        if (item.RetCode == 0) {
          let enrolllist = that.data.enrollInfo
          for (let i = 0; i < enrolllist.length; i++) {
            if (enrolllist[i].qid == e.currentTarget.dataset.id) {
              enrolllist[i].Buyed = 0
            }
          }
          that.setData({ enrollInfo: enrolllist })
        } else if (item.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal("支付失败！请重试");
        }
      })
    }
  }, showModal: function () {
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
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM代报名',
      path: '/pages/enroll/enroll'
    }
  },
  onShow: function () {
    var that = this
    if (that.data.session != null) {
      that.setData({
        showLoading: true
      })
      dataService.getUserEnroll(that.data.session, function (item) {
        if (item.RetCode == 0) {
          that.setData({
            enrollInfo: item.data
          })
        } else if (item.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          showLoading: false
        })
      })
    }
  },
  onLoad: function () {
    console.log('Index onLoad')

    var that = this
    that.setData({
      showLoading:true
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
      dataService.getUserEnroll(that.data.session, function (item) {
        if (item.RetCode == 0) {
          that.setData({
            enrollInfo: item.data
          })
        } else if (item.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          showLoading: false
        })
      })
    })

  }
})
