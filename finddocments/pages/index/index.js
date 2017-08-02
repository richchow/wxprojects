//index.js
//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService')
var message = ''
Page({
  data: {
    message: "",
    showLoading: false,
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
    userInfo: {}
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
  onLoad: function () {
    var that = this
    this.setData({
      showLoading: true
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
  onReady:function(){
    wx.showShareMenu({
      withShareTicket: true
    })
  }
  
})
