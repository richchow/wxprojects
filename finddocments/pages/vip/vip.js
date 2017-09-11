var app = getApp()
var payService = require('../../providers/payService.js')
Page({
  data: {
    session: '',
    userInfo: {},
    showModalStatus: false,
    animationData: {},
    vipdata: [{ title: '12个月', price: 185, original: 0, checked: true }, { title: '36个月', price: 365, original: 555, checked: false }],
    checkedVIP: 0,
    loading: false,
  },
  formSubmit: function (e) {
    this.setData({
      loading: true
    })
    var that = this
    payService.PayforVip(that.data.session, that.data.vipdata[that.data.checkedVIP].vipid, function (items) {
      if (items.RetCode == 0) {
       // if (e.detail.formId != undefined) {
       //   dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
       // }
        that.hideModal()
        app.showModal("感谢您购买VIP会员，您已可以享受VIP会员服务！")
      }
      else {
        app.showModal("支付失败，请重试！")
      }
      that.setData({
        loading: false
      })
    })

  },
  bindCheckedVIP: function (e) {
    let idx = e.currentTarget.dataset.idx
    let data = this.data.vipdata
    for (let i in data) {
      if (i == idx) {
        data[i].checked = true
      }
      else {
        data[i].checked = false
      }
    }
    this.setData({
      vipdata: data,
      checkedVIP: idx,
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
      })
    }.bind(this), 200)
  },
  onLoad: function (options) {
    var that = this
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
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: 'BIM找资料',
      path: '/pages/vip/vip',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})