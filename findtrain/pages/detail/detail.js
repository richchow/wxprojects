// pages/detail/detail.js
var app = getApp()
var dataService = require('../../providers/dataService.js')
Page({
  data: {
    showLoading: false,
    session: '',
    animationData: {},
    showModalStatus: false,
    showShareModalStatus: false,
    datainfo: {},
    imgUrls: [],
  },
  showPhone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.datainfo.signature
      ,
      success: function (res) {
        console.log('makePhoneCall:'.res)
        dataService.pushCallPhone(that.data.session,that.data.datainfo.dataid)
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
      showShareModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        showShareModalStatus: false
      })
    }.bind(this), 2000)
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
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      showLoading: true
    });
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
      //获得内容详情
      dataService.getDataInfo(options.id, session, function (items) {
        console.log('items:',items)
        if (items.RetCode == 0) {
          if (items.data != null) {
            that.setData({
              datainfo: items.data[0]
            })
            wx.setNavigationBarTitle({
              title: items.data[0].title
            })
            if (items.data != null && items.data[0].url != null && items.data[0].url != '') {
              let piclist = items.data[0].url.split('|')
              for(let i=0;i< piclist.length;i++){
                piclist[i] = app.getRequestUrl() +'webpic/pic/' + that.data.datainfo.dataid + "/" + piclist[i]
              }
              that.setData({
                imgUrls: piclist
              })
            }
          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }

        setTimeout(function () {
          that.setData({
            showLoading: false
          });
        }, 2000)
      })
    })
  },
  onShareAppMessage: function () {
      var that = this
    return {
      title: 'BIM找机构',
      path: '/pages/detail/detail?id=' + that.data.datainfo.dataid
    }
  }
})