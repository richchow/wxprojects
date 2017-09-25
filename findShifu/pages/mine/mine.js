var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    showFollowModalStatus:false,
    session: '',
    userInfo: {},
    newmessage: '',
    masterid:'',
    showModalStatus: false,
    animationData: {},
    adimg: '',
    adval: 0,
    adlist: ['', 'wx44dbe6d3e959af20', 'wx1db224ea2421cc64'],
    showMore: false,
    ogid: 0,
  },
  bindFollow:function(e){
    var that = this
    wx.setClipboardData({
      data: 'AIB平台',
      success: function (res) {
        that.showFollowModal()
      }
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
  showFollowModal: function () {
   
    this.setData({
      showFollowModalStatus: true,
    })

  },
  hideFollowModal: function () {
    this.setData({
        showFollowModalStatus: false,
    })
  },
  bindToApp: function (e) {
    let adval = this.data.adval
    let list = this.data.adlist
    app.getOgid(function(ogid){
      let addog = ogid == 0 ? '' : '?ogid=' + ogid
      console.log(list[adval])
      if (adval == 1 || adval == 2) {
        wx.navigateToMiniProgram({
          appId: list[adval] + addog,
          //  path: 'pages/index/index?id=123',
          //  extraData: {foo: 'bar'},
          //  envVersion: 'develop',
          success(res) {
          }
        })
      }
    })
    
  },
  bindShowAd: function (e) {
    let src = e.currentTarget.dataset.src
    let adval = e.currentTarget.dataset.adval
    this.setData({
      adimg: src,
      adval: adval,
    })
    this.showModal()
  },
  bindToVIP: function () {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
  bindShowMore: function (e) {
    let show = e.currentTarget.dataset.show
    this.setData({
      showMore: show == 'true' ? true : false,
    })
  },

  authSetting: function () {
    var that = this

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) {
                app.getUserInfo(function (userInfo) {
                  //更新数据
                  that.setData({
                    userInfo: userInfo
                  })
                })
                dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl, function (items) {
                  if (items.RetCode == 99) {
                    app.tokenError()
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) { 
  },
  onHide: function () {
    this.unreadPannel.hiden()
  },
  onShow: function () {
    var that = this
    this.setData({
      showLoading: true
    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      new app.UnreadPannel()
      that.unreadPannel.show({ token: that.data.session, requestUrl: app.getRequestUrl() })
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
      dataService.MasterCheck(that.data.session,function(items){
        if(items.RetCode == 0){
          that.setData({
            masterid: (items.data != null && items.data[0].length > 0) ? items.data : '',
          })
        }
      })
      dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
      dataService.HaveNewMessage(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            newmessage: items.data,
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