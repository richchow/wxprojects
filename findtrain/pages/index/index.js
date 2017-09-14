//index.js
//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService.js')
var util = require('../../utils/util.js')
var md5 = require('../../utils/md5.js')
Page({
  data: {
    showModalStatus: false,
    animationData: {},
    adimg: '',
    adval: 0,
    adlist: ['', 'wx44dbe6d3e959af20', 'wx13615b6f53349865'],
    showMore: false,
    session: '',
    showLoading: false,
    docItems: [
      {
        "dataid": 4,
        "title": "柏慕联创工程技术服务有限公司",
        "describe": "点亮建筑新梦想 LIGHT BUILDING NEW DREAM推出BIM系统实战新课程",
        "amount": null,
        "url": "1.jpg|2.jpg|3.jpg",
        "signature": "18010642744",
        "type": "1",
        "picurs": null,
        "picurd": null
      }
    ],
    userInfo: {}
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
    console.log(list[adval])
    if (adval == 1 || adval == 2) {
      wx.navigateToMiniProgram({
        appId: list[adval],
        //  path: 'pages/index/index?id=123',
        //  extraData: {foo: 'bar'},
        //  envVersion: 'develop',
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
  showPhone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: '18813063862'
    })
  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找机构',
      path: '/pages/index/index'
    }
  },
  onLoad: function () {
    console.log('Index onLoad')
    /* var secret = "75adbcdde224d2db13b6db4343199b3a"
     var name = "zzl"
     var hex = util.randomHEX()
     var headerMD5 = util.headerMD5(name,hex,secret)
                   var sign = md5.hex_md5(headerMD5).toUpperCase()
     console.log("requestSource=\""+name+"|0x"+hex+"|"+sign+"\"")
      */
    var that = this
    that.setData({
      showLoading: true
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
      dataService.getSyd(function (item) {
     //   if (item.RetCode == 0) {
          that.setData({
            docItems: item
          })
    /*    } else if (item.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal("数据错误，请稍后重试");
        }*/
        that.setData({
          showLoading: false
        })
      })
    })

  }
})
