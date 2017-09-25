var templateService = require('../../providers/templateService')
var time
let _compData = {
  '__urpanel__.unreadnum': '',
  '__urpanel__.showUnread': 2,
  '__urpanel__.animationData': {},
  '__urpanel__.token': '',
  '__urpanel__.dataService': null,
  '__urpanel__.requestUrl': '',
}
let _compEvent = {
  //begin 未读信息
  __urpanel__showUnread: function () {
    // 显示遮罩层
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateX(300).step()
    this.setData({
      '__urpanel__.animationData': animation.export(),
      '__urpanel__.showUnread': 0,
    })
    setTimeout(function () {
      animation.translateX(0).step()
      this.setData({
        '__urpanel__.animationData': animation.export()
      })
    }.bind(this), 200)
    setTimeout(function () {
      that.__urpanel__showUnread_small()
    }.bind(this), 5000)
  },
  __urpanel__showUnread_small: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateX(300).step()
    this.setData({
      '__urpanel__.animationData': animation.export(),
      '__urpanel__.showUnread': 1,
    })
    setTimeout(function () {
      animation.translateX(0).step()
      this.setData({
        '__urpanel__.animationData': animation.export()
      })
    }.bind(this), 200)
  },
  __urpanel__hideUnread: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateX(300).step()
    this.setData({
      '__urpanel__.animationData': animation.export(),
    })
    setTimeout(function () {
      animation.translateX(0).step()
      this.setData({
        '__urpanel__.animationData': animation.export(),
        '__urpanel__.showUnread': 2,
      })
    }.bind(this), 200)
  },
  __urpanel__Tolist: function () {
    wx.navigateTo({
      url: '/pages/unreadlist/unreadlist',
    })
  },
  __urpanel__flush: function () {
    var that = this
    templateService.alertMessage(this.data.__urpanel__.token, that.data.__urpanel__.requestUrl, function (items) {
      if (items.RetCode == 0) {
        that.setData({
          '__urpanel__.unreadnum': items.data != null && items.data.length > 0 ? items.data[0] : '',
        })
        if (items.data != null && items.data.length > 0 && items.data[0] != '') {
          that.__urpanel__showUnread()
        } else {
          that.__urpanel__hideUnread()
        }
      }

    })
  },
  __urpanel__Time: function () {
    var that = this
     time = setInterval(function () {
      templateService.alertMessage(that.data.__urpanel__.token, that.data.__urpanel__.requestUrl, function (items) {
        console.log('unreadPannel time')
        if (items.RetCode == 0) {
          that.setData({
            '__urpanel__.unreadnum': items.data != null && items.data.length > 0 ? items.data[0] : '',
          })
          if (that.data.__urpanel__.unreadnum == '' && that.data.__urpanel__.showUnread != 2){
            that.__urpanel__hideUnread()
          }
          else if (that.data.__urpanel__.unreadnum.length > 0 && that.data.__urpanel__.showUnread == 2) {
            that.__urpanel__showUnread()
          }
        }
      })
    }, 30 * 1000)
  },
  //end 未读信息
}

let unreadPannel = {
  show: function (data) {
    var that = this
    if (data) {
      Object.assign(this._configs, data)
    }
    that.__page.setData({
      '__urpanel__.token': that._configs.token,
      '__urpanel__.requestUrl': that._configs.requestUrl
    })
    console.log('unreadPannel start')
    templateService.alertMessage(this._configs.token, that._configs.requestUrl, function (items) {
      if (items.RetCode == 0) {
        that.__page.setData({
          '__urpanel__.unreadnum': items.data != null && items.data.length > 0 ? items.data[0] : '',
        })
        if (items.data != null && items.data.length > 0 && items.data[0] != '') {
          that.__page.__urpanel__showUnread()
        }
      }
    })
    that.__page.__urpanel__Time()
  },
  hiden:function(){
    console.log('unreadPannel hidden')
    clearInterval(time)
  },
}

function UnreadPannel() {
  // 定义组件的一些回调
  this._configs = {
    token: '',
    requestUrl: '',
  }
  // 拿到当前页面对象
  let pages = getCurrentPages()
  let curPage = pages[pages.length - 1]

  // 把组件的事件“合并到”页面对象上
  Object.assign(curPage, _compEvent)

  this.__page = curPage

  // 附加到page上，方便访问

  Object.assign(this, unreadPannel)

  curPage.unreadPannel = this

  // 把组件的数据“注入”到页面的data对象中
  curPage.setData(_compData)

  return this
}

module.exports = {
  UnreadPannel
}