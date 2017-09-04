var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
  walletinfo:{},
  userInfo:{},
  session:'',
  disabled:false,
  showModalStatus:false,
  animationData:{},
  showLoading:true,
  loading:false,
  },
  bindWalletGet:function(e){
  /*  wx.navigateTo({
      url: '/pages/walletlist/walletlist',
    })
    */
  },
  formSubmit:function(e){
    this.setData({
      loading: true
    })
    var that = this
    if (e.detail.value.amount === '' || (e.detail.value.amount > walletinfo.applyAmount)) {
      app.showModal("填写金额有误！请确认后再试！")
      that.setData({
        loading: false
      })
    } else {
    /*  subRoomService.CreatSubRoom(that.data.session, that.data.sroomid, e.detail.value.name, Number(e.detail.value.num), that.data.today, that.data.date, that.data.userid, function (items) {
        if (items.RetCode == 0) {
          if (e.detail.formId != undefined) {
            dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
          }
          that.hideModal()
        }
        else {
          app.showModal("提现申请失败，请重试！")
        }
        that.setData({
          loading: false
        })
      })*/
    }
  },
  bindToP:function(){
    wx.navigateTo({
      url: '/pages/policy/policy',
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
    this.setData({
      showLoading: true,
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
      dataService.WalletInfo(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            walletinfo: items.data[0]
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
  },
})