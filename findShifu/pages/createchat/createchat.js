var app = getApp()
var dataService = require('../../providers/dataService.js')
Page({
  data: {
    loading:false,
    nameVail:'inputClass',
    numVail:'inputClass',
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
    if (e.detail.value.num === '') {
      err = true
      this.setData({
        numVail: "input-error"
      })
    } else {
      this.setData({
        numVail: "inputClass"
      })
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else { }
  },
  onLoad: function (options) {
  
  },

})