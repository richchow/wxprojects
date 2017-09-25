var app = getApp()
var payService = require('../../providers/payService.js')
var dataService = require('../../providers/dataService.js')
Page({
  data: {
    session: '',
    userInfo: {},
    showModalStatus: false,
    animationData: {},
    vipdata: null,//[{ title: '12个月', price: 185, original: 0, checked: true }, { title: '36个月', price: 365, original: 555, checked: false }],
    checkedVIP: 0,
    loading: false,
    iHaveUid:-1,
    iVip: -1,
    unionId:'',
  },
  formSubmit: function (e) {
    this.setData({
      loading: true
    })
    var that = this
    payService.PayforVip(that.data.session, that.data.unionId, that.data.vipdata[that.data.checkedVIP].vipid, function (items) {
      if (items.RetCode == 0) {
        if (e.detail.formId != undefined && e.detail.formId != 'the formId is a mock one') {
          dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
        }
        that.hideModal()
        wx.showModal({
          title: '成功',
          showCancel: false,
          content: '感谢您购买VIP会员，您已可以享受VIP会员服务！请关注AIB平台公众号及时获得最新消息！',
          success: function (res) {
            if (res.confirm) {
              that.setData({ isVip: 0, endDate: null })
              app.setiVip({ isVip: 0, endDate: null })
            }
          }
        })
        
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
      app.getiHaveUid(function (iHaveUid) {
        let haveUid = iHaveUid
        let uid = ''
        if (iHaveUid == 0) {
          app.getUnionId(function (unionid) {
            uid = unionid
          })
          that.setData({
            iHaveUid: haveUid,
            unionId: uid
          })
        }
        else {
          that.setData({
            iHaveUid: haveUid,
          })
        }

      })
      app.getiVip(function (iVip) {

        that.setData({
          iVip: iVip
        })
      })
    
      dataService.Vipdata(function (item) {
        if (item.RetCode == 0) {
          if (item.data != null && item.data.length > 0) {
            for (let i in item.data) {
              if (i == 0) {
                Object.assign(item.data[i], { checked: true })
              } else {
                Object.assign(item.data[i], { checked: false })
              }
            }
          }
          that.setData({
            vipdata: item.data
          })
        }
      })
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: 'BIM找师傅',
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