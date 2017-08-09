// pages/edit/edit.js
Page({

  data: {
    loading:false,
    nameVail: 'inputClass',
    phoneVail:'inputClass',
    wxVail: 'inputClass',
    qqVail: 'inputClass',
    areaVail: 'inputClass',
    picurl:'',
    picurlVail:'sf_card_userimg',
  },
  btnUploadImg:function(e){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({ picurl: res.tempFilePaths})
      }
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
    if (e.detail.value.phone === '') {
      err = true
      this.setData({
        phoneVail: "input-error"
      })
    } else {
      this.setData({
        phoneVail: "inputClass"
      })
    }
    if (e.detail.value.wx === '') {
      err = true
      this.setData({
        wxVail: "input-error"
      })
    } else {
      this.setData({
        wxVail: "inputClass"
      })
    }
    if (e.detail.value.qq === '') {
      err = true
      this.setData({
        qqVail: "input-error"
      })
    } else {
      this.setData({
        qqVail: "inputClass"
      })
    }
    if (e.detail.value.area === '') {
      err = true
      this.setData({
        areaVail: "input-error"
      })
    } else {
      this.setData({
        areaVail: "inputClass"
      })
    }
    if (this.data.picurl === '') {
      err = true
      this.setData({
        picurlVail: "sf_card_userimg_error"
      })
    } else {
      this.setData({
        picurlVail: "sf_card_userimg"
      })
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else {
 
    }
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },

})