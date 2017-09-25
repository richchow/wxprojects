//index.js
//获取应用实例
var app = getApp()
var dataService = require('../../providers/dataService.js')
var payService = require('../../providers/payService.js')
Page({
  data: {
    loading: false,
    session: '',
    showLoading: false,
    animationData: {},
    showModalStatus: false,
    userInfo: {},
    checked: [true, false],
    coursechecked: {},
    iVip: -1,
    list: {},
    /*  list: {
        courselist: [
          { id: 1, companyname: '腿腿网', call: '18612121474', price: '20', pricedes: '抵扣200元', title: '第十一期全国BIM技能等级一级考试辅导班', des1: '课程价格:¥1000', des2: '开课时间:2017-09-21', des3: '使用地区:厦门面授', detail:'共计4天课，全天课程，专门针对BIM一级等级考试辅导班，基础操作入门、小别墅案例、考点、难点、历年真题解析' },
          { id: 2, companyname: '柏慕联创', call: '18612121474', price: '200', pricedes: '价值¥5000', title: '《Revit Architecture 2016综合训练入门及高级》', des1: '课程价格:¥10000', des2: '开课时间:每年8月', des3: '使用地址:北京', detail: '222' }],
        payedlist: [
          { id: 3, companyname: '柏慕联创', call: '18612121474', price: '200', pricedes: '价值¥5000', title: 'revit课程代金券3', des1: '课程价格:¥10000', des2: '开课时间:每年8月', des3: '使用地址:北京', detail: '333' },
          { id: 4, companyname: '柏慕联创', call: '18612121474', price: '200', pricedes: '价值¥5000', title: 'revit课程代金券4', des1: '课程价格:¥10000', des2: '开课时间:每年8月', des3: '使用地址:北京', detail: '444' }],
      } */
  },
  bindStatus: function (e) {
    let c = e.currentTarget.dataset.c
    let checked = this.data.checked
    if (!checked[c]) {
      for (let i in checked) {
        checked[i] = false
      }
      checked[c] = !checked[c]
    }

    this.setData({ checked: checked })
  },
  bindCall: function (e) {
    let call = e.currentTarget.dataset.call
    wx.makePhoneCall({
      phoneNumber: call
    })
  },
  bindCheckedPay: function (e) {
    let that = this
    let idx = e.currentTarget.dataset.idx
    this.setData({
      coursechecked: that.data.list.courselist[idx]
    })
    this.showModal()
  },
  bindToUse: function () {
    wx.navigateTo({
      url: '/pages/use/use',
    })
  },
  pay: function () {
    var that = this
    payService.pay(that.data.coursechecked.courseid, that.data.session, function (item) {
      if (item.RetCode == 0) {
        that.hideModal()
        app.showModal("支付成功！")
        onLoad()

      } else if (item.RetCode == 99) {
        app.tokenError()
      } else {
        app.showModal("支付失败！请重试");
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
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找机构',
      path: '/pages/enroll/enroll'
    }
  },
  onLoad: function () {
    console.log('Index onLoad')

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
      app.getiVip(function (iVip) {
        that.setData({
          iVip: iVip
        })
      })
      dataService.ogCourseList(that.data.session, function (item) {
        if (item.RetCode == 0) {
          if (that.data.iVip.isVip == 0) {
            for (let i in item.data[0].courselist) {
              item.data[0].payedlist.push(item.data[0].courselist[i])
            }
            item.data[0].courselist = []
            that.setData({ checked: [false, true]})
          }
          that.setData({
            list: item.data[0]
          })
        } else if (item.RetCode == 99) {
          app.tokenError()
        } else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          showLoading: false
        })
      })
    })

  }
})
