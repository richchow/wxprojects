var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    showLoading: false,
    session: '',
    sfItems: {},
    showModalStatus: false,
    animationData: {},
    adimg: '',
    adval: 0,
    adlist: ['','wx44dbe6d3e959af20', 'wx1db224ea2421cc64'],
    showMore: false,
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

  onShow: function () {
    var that = this
    this.setData({
      showLoading: true,
    })
    new app.UnreadPannel()
    // that.unreadPannel.show({ unreadnum: 5 })

    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      dataService.alertMessage(that.data.session, function (items) {
        if (items.RetCode == 0) {
          that.unreadPannel.show({ unreadnum: items.data[0] })
        }
        else if (items.RetCode == 99) {
          app.tokenError()
        }
      })

      dataService.getMasterListAll(that.data.session, '', '', function (items) {
        if (items.RetCode == 0) {
          for (let i in items.data) {
            if (items.data[i].picurl.indexOf('http') < 0) {
              items.data[i].picurl = app.getRequestUrl() + 'MpicData/' + items.data[i].masterid + '/' + items.data[i].picurl
            }
          }
          that.setData({
            sfItems: items.data,
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
          that.onShow()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
      })

      that.setData({
        showLoading: false
      })
    })
  },
  onLoad: function (options) {
  //  let scene = 'br_11,uid_49'

    let scene = decodeURIComponent(options.scene)
    console.log('find scene:', scene)
    if (scene != null) {
      let bval = scene.split(',')
      if (bval.length == 2) {
        let roomid = bval[0].split('_')
        let uid = bval[1].split('_')
        if (roomid.length == 2 && uid.length == 2) {
          app.getSession(function (session) {
            console.log('session:', scene, ',uid[1]:', uid[1], ',roomid[1]:', roomid[1])
            dataService.binAgent(session, uid[1], roomid[1], function (items) {
              console.log('binAgent:', items)
              if (items.RetCode == 0) {
                wx.redirectTo({
                  url: '/pages/shifu/shifu?id=' + items.data[0],
                })
              }

            })
          })
        }
      }
      else {
        let val = scene.split('_')
        if (val.length == 2) {
          wx.redirectTo({
            url: '/pages/passkey/passkey?id=' + val[1],
          })
        }
      }
    }

  },
  onReady: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl, function (items) {
        if (items.RetCode == 99) {
          app.tokenError()
        }
      })
    })
  },

})