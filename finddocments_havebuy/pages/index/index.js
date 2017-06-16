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
    isPayed: true,
    scrollTop: 0,
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
    docItems: [
      {
        dataid: 1,
        title: "60GPPT资源",
        describe: "500个PPT风格模板、字体库、高清图片、60GPPT资料",
        amount: "49",
        url: "http://pan.baidu.com/s/1i5eFPdz",
        signature: "q4yq",
        type: "6",
        picurs: 'https://wx.jycloud.cc/datapic/zzl/s/1.png',
        picurd: 'https://wx.jycloud.cc/datapic/zzl/d/1.png'
      },
      {
        dataid: 16,
        title: "BIM电子文本资料合集包",
        describe: "包含BIM收费标准/BIM90本电子书/BIM厂商资料/BIM考试真题等内容（注：后续陆续每周更新...",
        amount: "98",
        url: "http://pan.baidu.com/s/1slbH8bN",
        signature: "13ys",
        type: "1",
        picurs: 'https://wx.jycloud.cc/datapic/zzl/s/16.png',
        picurd: 'https://wx.jycloud.cc/datapic/zzl/d/16.png'
      },
      {
        dataid: 23,
        title: "BIM历届等级考试真题",
        describe: "建筑信息模型考试题/BIM等级考试大纲/第一期～第八期",
        amount: "9",
        url: "http://pan.baidu.com/s/1hsn5sv6",
        signature: "xoem",
        type: "4",
        picurs: 'https://wx.jycloud.cc/datapic/zzl/s/23.png',
        picurd: 'https://wx.jycloud.cc/datapic/zzl/d/23.png'
      },
      {
        dataid: 26,
        title: "BIM电子文本资料合集包",
        describe: "包含BIM收费标准/BIM90本电子书/BIM厂商资料/BIM考试真题等内容（注：后续陆续每周更新...",
        amount: "98",
        url: "http://pan.baidu.com/s/1slbH8bN",
        signature: "13ys",
        type: "5",
        picurs: 'https://wx.jycloud.cc/datapic/zzl/s/26.png',
        picurd: 'https://wx.jycloud.cc/datapic/zzl/d/26.png'
      },
      {
        dataid: 27,
        title: "20GBIM族库资源包",
        describe: "包含（建筑/结构/给排水/暖通/电气/装饰/施工常用族）20G各专业上千族库资源（...",
        amount: "9.9",
        url: "http://pan.baidu.com/s/1eS9ocOM",
        signature: "zmsu",
        type: "2",
        picurs: 'https://wx.jycloud.cc/datapic/zzl/s/27.png',
        picurd: 'https://wx.jycloud.cc/datapic/zzl/d/27.png'
      },
      {
        dataid: 29,
        title: "BIM常用软件视频课程（集...",
        describe: "包含revit建筑教程/revit结构教学视频/revitMEP机电教程/Navisworks教程视频/lum...",
        amount: "199",
        url: "http://pan.baidu.com/s/1bpmZZm3 ",
        signature: "0q12",
        type: "3",
        picurs: 'https://wx.jycloud.cc/datapic/zzl/s/29.png',
        picurd: 'https://wx.jycloud.cc/datapic/zzl/d/29.png'
      }
    ],
    userInfo: {}
  },
  btnClick: function (e) {
    wx.navigateTo({
      url: '/pages/list/list?type=catalog&val=' + e.target.dataset.item
    })

  },
  btnToSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  bindChange: function (e) {
    message = e.detail.value
  },
  btnSearch: function () {
    var that = this
    //获得值得一看
    dataService.getDataInfoList(message, '', function (DataInfoList) {
      that.setData({
        docItems: DataInfoList.item
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找资料',
      path: '/pages/index/index'
    }
  },
  onLoad: function () {
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
      dataService.getUserPayed(that.data.session, function (items) {
        if (items.RetCode == 0) {
          if (items.data != 0) {
            //更新数据
            that.setData({
              isPayed: false
            })
          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
      })

    })
  }
})
