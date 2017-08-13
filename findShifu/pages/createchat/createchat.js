var app = getApp()
var subRoomService = require('../../providers/subRoomService.js')
var util = require('../../utils/util.js')
Page({
  data: {
    loading: false,
    nameVail: 'inputClass',
    numVail: 'inputClass',
    name: '',
    sroomid:-1,
    date: '',
    today: '',
    userid: '',
    roomindex: 0,
    roomarray: [],
    roomobjectArray: [],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
  },
  bindRoomChange: function (e) {
    var that = this
    this.setData({
      roomindex: e.detail.value,
      name: that.data.roomobjectArray[e.detail.value].title,
      sroomid: that.data.roomobjectArray[e.detail.value].sid
    })

  },
  bindKeyInput: function (e) {
    this.setData({
      name: e.detail.value,
      sroomid:-1,
    })
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
      subRoomService.CreatSubRoom(that.data.session,that.data.sroomid, e.detail.value.name, Number(e.detail.value.num), that.data.today, that.data.date, that.data.userid, function (items) {

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
    var that = this
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
      subRoomService.getBaseSRoom(that.data.session, function (item) {
        if (item.RetCode == 0) {
          let array = new Array()
          for(let i in item.data){
            array.push(item.data[i].title + '('+item.data[i].enddate+')')
          }
          that.setData({
            roomobjectArray: item.data,
            roomarray:array,
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
      })

    })
  },

})