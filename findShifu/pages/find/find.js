var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    showFollowModalStatus: false,
    showFlush:false,
    showLoading: false,
    session: '',
    sfItems: {},
    showModalStatus: false,
    animationData: {},
    adimg: '',
    adval: 0,
    adlist: ['', 'wx44dbe6d3e959af20', 'wx1db224ea2421cc64'],
    showMore: false,
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
    let pathlist = ['','pages/index/index', 'pages/index/index']
    console.log(list[adval])
    if (adval == 1 || adval == 2) {
      wx.navigateToMiniProgram({
        appId: list[adval],
        path: pathlist[adval] + addog,
        //  extraData: {foo: 'bar'},
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

  onShow: function () {
    if (this.data.session != ''){
      new app.UnreadPannel()
      this.unreadPannel.show({ token: this.data.session, requestUrl: app.getRequestUrl() })
    }
    
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
    if (options.ogid != null) {
      console.log('index ogid:', options.ogid)
      this.setData({ ogid: options.ogid})
        app.bindOGId(options.ogid)
    }
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
        dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl, function (items) {
          if (items.RetCode == 99) {
            app.tokenError()
          }
        })
      })
      new app.UnreadPannel()
      that.unreadPannel.show({ token: session, requestUrl: app.getRequestUrl() })
      dataService.getMasterListAll(session, '', '', function (items) {
        if (items.RetCode == 0) {
          that.setData({
            showFlush:true
          })
          for (let i in items.data) {
            if (items.data[i].picurl.indexOf('http') < 0) {
              items.data[i].picurl = app.getRequestUrl() + 'MpicData/' + items.data[i].masterid + '/' + items.data[i].picurl
            }
          }
          that.setData({
            sfItems: items.data,
          })
          setTimeout(function(){
            that.setData({
              showFlush: false
            })
          }, 2 * 1000)
        } else if (items.RetCode == 99) {
          app.tokenError()
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
  onPullDownRefresh:function() {
    var that = this
    console.log('onPullDownRefresh start')
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
      }
      else {
        app.showModal("数据错误，请稍后重试");
      } 
      wx.stopPullDownRefresh()
    })
  },
  onHide: function () {
    this.unreadPannel.hiden()
  },
  onReady: function () {
    var that = this
    
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找师傅',
      path: '/pages/find/find'
    }
  },
})