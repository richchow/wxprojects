//index.js
//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService')
var message = ''
Page({
  data: {
    showFollowModalStatus: false,
    showModalStatus: false,
    animationData: {},
    adimg: '',
    adval: 0,
    adlist: ['', 'wx1db224ea2421cc64', 'wx13615b6f53349865'],
    message: "",
    showLoading: false,
    showMore: false,
    session: '',
    scrollTop: 0,
    hotStarItems: {},
    hotItems: [
      {
        "catalogid": 4,
        "catainfo": "BIM软件安装包",
        "sid": 1
      },
      {
        "catalogid": 7,
        "catainfo": "BIM考试",
        "sid": 2
      },
      {
        "catalogid": 6,
        "catainfo": "BIM资料",
        "sid": 3
      },
      {
        "catalogid": 9,
        "catainfo": "BIM初学者教程",
        "sid": 4
      },
      {
        "catalogid": 8,
        "catainfo": "BIM族库",
        "sid": 5
      },
      {
        "catalogid": 5,
        "catainfo": "BIM插件",
        "sid": 6
      }
    ],
    docItems: [],
    userInfo: {},
    ogid: 0,
  },
  showFollowModal: function () {
    var that = this
    wx.setClipboardData({
      data: 'AIB平台',
      success: function (res) {
        that.setData({
          showFollowModalStatus: true,
        })
      }
    })
  },
  hideFollowModal: function () {
    this.setData({
      showFollowModalStatus: false,
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
  bindToApp: function (e) {
    let adval = this.data.adval
    let list = this.data.adlist
    let addog = this.data.ogid == 0 ? '' : '?ogid=' + this.data.ogid
    let pathlist = ['', 'pages/index/index', 'pages/find/find']
    console.log(list[adval])
    if (adval == 1 || adval == 2) {
      wx.navigateToMiniProgram({
        appId: list[adval],
        path: pathlist[adval] + addog,
        // extraData: { ogid: this.data.ogid},
        envVersion: 'trial',
        success(res) {
        }
      })
    }
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
  bindToTuli: function (e_index_1) {
    wx.previewImage({
      urls: [app.getRequestUrl() + 'datapic/zzl/tuli.png'] // 需要预览的图片http链接列表
    })
  },
  btnToArdent: function (e_index_2) {
    wx.navigateTo({
      url: '/pages/ardent/ardent'
    })
  },
  btnClick: function (e_index_3) {
    wx.navigateTo({
      url: '/pages/list/list?type=catalog&val=' + e_index_3.target.dataset.item
    })

  },
  btnToSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: 'BIM找资料',
      path: '/pages/index/index',
      success: function (res) {
        app.getSession(function (session) {
          that.setData({
            session: session
          })
          app.getUserInfo(function (userInfo) {
            that.setData({
              userInfo: userInfo
            })
            // 分享成功
            dataService.PushUserPic(that.data.session, userInfo.nickName, userInfo.avatarUrl)
            dataService.putDataSharp(that.data.session, -1)
          })
        })
      }
    }
  },
  onLoad: function (options) {
    var that = this


    this.setData({
      showLoading: true
    })
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      app.getUserInfo(function (userInfo) {
        that.setData({
          userInfo: userInfo
        })
        dataService.PushUserPic(that.data.session, userInfo.nickName, userInfo.avatarUrl)
      })
      if (options.ogid != null) {
        console.log('index ogid:', options.ogid)
        that.setData({
          ogid: options.ogid
        })
        app.bindOGId(options.ogid)
      }
    })

    dataService.getsyDataCatalogList(function (items) {
      if (items.RetCode == 0) {
        that.setData({
          hotStarItems: items.data
        })
      }
    })
    dataService.getSyd('', function (items) {
      that.setData({
        docItems: items
      })

    })
    that.setData({
      showLoading: false
    })

  },
  onReady: function () {
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，为了更好的享受服务，请升级到最新微信版本后重试。'
      })
    }
  }

})
