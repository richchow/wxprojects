var app = getApp()
var dataService = require('../../providers/dataService')
Page({

  data: {
    loading: false,
    masterid: '',
    userInfo: {},
    nameVail: 'inputClass',
    phoneVail: 'inputClass',
    wxVail: 'inputClass',
    qqVail: 'inputClass',
    areaVail: 'inputClass',
    picurl: '',
    picurlVail: 'sf_card_userimg',
    name: '',
    phone: '',
    wx: '',
    qq: '',
    area: '',
    serviceArray: [],
    content: '',
  },
  btnUploadImg: function (e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({ picurl: res.tempFilePaths })
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
    if (e.detail.value.content === '') {
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
    let service = this.data.serviceArray
    let checkedservice = ''
    for (let i in service) {
      if (service[i].checked) {
        checkedservice += service[i].describe+ '|'
      }
    }
    if (checkedservice.length <= 0){
      err = true
      this.setData({
        areaVail: "input-error"
      })
    } else {
      this.setData({
        areaVail: "inputClass"
      })
      checkedservice = checkedservice.substr(0, checkedservice.length -1)
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else {
      let service = ''
      dataService.ModiMasterInfo(that.data.session, that.data.masterid, e.detail.value.name, e.detail.value.phone, e.detail.value.wx, e.detail.value.qq, e.detail.value.content, checkedservice, e.detail.value.area, that.data.picurl, function (items) {
        if (item.RetCode == 0) {

        }
      })
    }
  },
  bindCheckedlab:function(e){
    let service = this.data.serviceArray
    for(let i in service){
      if (service[i].sid == e.currentTarget.dataset.sid){
        service[i].checked = !service[i].checked
      }
    }
    this.setData({ serviceArray:service})
  },
  onLoad: function (options) {
    var that = this
    if (options.masterid != undefined) {
      this.setData({
        showLoading: true,
        masterid: options.masterid,
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

        let currServiceArray = []
        let allServiceArray = []
        dataService.getServices(that.data.session, function (item) {
          if (item.RetCode == 0) {
            allServiceArray= item.data
          }

        })
        dataService.getMasterListSignle(that.data.session, that.data.masterid, function (items) {
          if (items.RetCode == 0) {
            let checkedService = {}
            let service=items.data[0].serviceArry
            for (let i in allServiceArray){
              if (service.indexOf(allServiceArray[i].describe) > 0){
                checkedService = { checked: true }
              }else{
                checkedService = { checked: false }
              }
              Object.assign(allServiceArray[i], checkedService)

            }
            that.setData({
              name: items.data[0].mastername,
              phone: items.data[0].mobile,
              wx: items.data[0].wxid,
              qq: items.data[0].mail,
              area: items.data[0].address,
              picurl: items.data[0].picurl,
              content: items.data[0].profiles,
              serviceArray: allServiceArray,
            })
          }
          that.setData({
            showLoading: false
          })
        })
        
      })
    }
  },


})