let _compData = {
  '__urpanel__.unreadnum': 0,
  '__urpanel__.showUnread': false,
  '__urpanel__.animationData': {},
}

let _compEvent = {
  //begin 未读信息
  __urpanel__showUnread: function () {
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
      '__urpanel__.showUnread': true,
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
        '__urpanel__.showUnread': false,
      })
    }.bind(this), 200)
  },
  __urpanel__Tolist: function () {
    wx.navigateTo({
      url: '/pages/unreadlist/unreadlist',
    })
  },
  //end 未读信息
}

let unreadPannel = {
  show: function (data) {
    if (data) {
      Object.assign(this._configs, data)
    }
    if(this._configs.unreadnum> 0){

      this.__page.setData({ 
        '__urpanel__.showUnread': true,
        '__urpanel__.unreadnum': this._configs.unreadnum,
       })
    }
  }
}

function UnreadPannel() {
  // 定义组件的一些回调
  this._configs = {
    unreadnum: 0,
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