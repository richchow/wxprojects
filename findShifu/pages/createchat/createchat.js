var app = getApp()
var subRoomService = require('../../providers/subRoomService.js')
var util = require('../../utils/util.js')
Page({
  data: {
    loading: false,
    nameVail: 'inputClass',
    numVail: 'inputClass',
    date: '',
    today: '',
    userid: '',
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      loading: true
    })
    var err = false
    var that = this
    if (e.detail.value.name === '') {
      err = true
      this.setData({
        nameVail: "input-error"
      })
    } else {
      this.setData({
        nameVail: "inputClass"
      })
    }
    if (that.data.userid != '') {
      if (e.detail.value.num === '' || Number(e.detail.value.num) < 1) {
        err = true
        this.setData({
          numVail: "input-error"
        })
      } else {
        this.setData({
          numVail: "inputClass"
        })
      }
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else {
      subRoomService.makeorder(that.data.session, e.detail.value.name, Number(e.detail.value.num), that.data.today, that.data.date, that.data.userid, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            loading: false
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function (options) {
    var today = util.getNextMonth(new Date().toLocaleDateString().split('/').join('-'))
    this.setData({
      date: today,
      today: new Date().toLocaleDateString().split('/').join('-'),
      userid: options.userid ? options.userid : ''
    })
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


    })
  },

})