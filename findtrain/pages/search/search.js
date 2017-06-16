//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService.js');
Page({
  data: {
    showLoading: false,
    session: '',
    isPayed: true,
    regionItems:
    [
    ],
    userInfo: {}
  },
  btnClick: function (e) {
    console.log(e.target.dataset.item);
    wx.navigateTo({
      url: '/pages/list/list?type=catalog&val=' + e.target.dataset.item
    })
  },
  onLoad: function () {
    console.log('Index onLoad')


    var that = this
    this.setData({
      showLoading: true
    });
    //获得session
    app.getSession(function (session) {
      console.log("session:" + session)
      that.setData({
        session: session
      })
      if (session == null || session == '') {
        app.showModal('数据获取错误！请重启小程序再试！');
      }

      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })


      //获得热门搜索
      dataService.getDataCatalogList(function (items) {
        if (items.RetCode == 0) {
          that.setData({
            regionItems: items.data
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
      })
      that.setData({
        showLoading: false
      });
    })

  }
})
