var app = getApp()
var dataService = require('../../providers/dataService')
var inttime
Page({
  data: {
    hastalked: false,
    loading: false,
    tempimg: [],
    temptalk: '',
    tempvideo: '',
    succesimg: '',
    succestalk: '',
    succesvideo: '',
    videonum: 0,
    imgnum: 0,
    userinfo: {},
    session: '',
    talkmsg: '点击开始录音',
    talkStatus: false,
    talktime: 1,
    masterid: '',
  },
  formSubmit: function (e) {
    this.setData({
      loading: true
    })
    var err = true
    var that = this
    if (e.detail.value.content != ''
      || this.data.succesimg != ''
      || this.data.succestalk != ''
      || this.data.succesvideo != '') {
      err = false
    }

    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else {
      let files = that.data.succesimg + that.data.succestalk + that.data.succesvideo
      files = files.length > 0 ? files.substring(0, files.lastIndexOf('|')) : files

      dataService.MasterPushContent(that.data.session, that.data.masterid, files, e.detail.value.content, function (items) {
        if (items.RetCode == 0) {
          if (e.detail.formId != undefined && e.detail.formId != 'the formId is a mock one') {
            dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
          }
          app.getBigRoomList(that.data.masterid, function (item) {
            if (item.sfItems instanceof Array) {
              item.sfItems[0].ltRoomInfos.unshift(items.data[0])
            } else {
              let sf = item.sfItems
              item.sfItems = new Array()
              item.sfItems.unshift(sf)
              item.sfItems[0].ltRoomInfos = new Array()
              item.sfItems[0].ltRoomInfos.unshift(items.data[0])
            }
            app.setBigRoomList(that.data.masterid, item)
          })
          app.setBBflush(true)
          wx.navigateBack({
            delta: 1
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          loading: false
        })
      })
    }
  },
  bindbtnBack: function (e) {
    app.setBBflush(true)
    wx.navigateBack({
      delta: 1
    })
  },
  updateVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        dataService.uploadFiles(that.data.session, that.data.masterid, 2, that.data.succesvideo, new Array(res.tempFilePath), 0, 1, function (item) {
          that.setData({
            succesvideo: item,
            tempvideo: res.tempFilePath,
            videonum: 1,
          })
        })
      }
    })
  },
  delVideo: function (e) {
    var that = this
    dataService.MasterDelFiles(that.data.session, that.data.masterid, e.currentTarget.dataset.url, function (item) {
      if (item.RetCode == 0) {
        that.setData({
          succesvideo: '',
          tempvideo: '',
          videonum: 0
        })
      }
    })
  },
  bindTalk: function () {
    var that = this
    that.setData({
      talkStatus: true
    })
    var time = 1
    inttime = setInterval(function () {
      that.setData({
        talkmsg: '录音中 ' + time + '"',
        talktime: time,
      })
      time++
    }, 1000)
    wx.startRecord({
      success: function (res) {
        let temp = res.tempFilePath
        dataService.uploadFiles(that.data.session, that.data.masterid, Number('3'+time), that.data.succestalk, new Array(res.tempFilePath), 0, 1, function (item) {
          that.setData({
            succestalk: item,
            temptalk: temp,
            hastalked: true,
          })
        })
      },
      fail: function (res) {
        //录音失败
      }
    })
  },
  bindOverTalk: function () {
    var that = this
    that.setData({
      talkStatus: false,
      hastalked: true,
      talkmsg: '时长： ' + that.data.talktime + '"'
    })
    clearInterval(inttime)
    wx.stopRecord()
  },
  playVoice: function (e) {
    wx.playVoice({
      filePath: e.currentTarget.dataset.talk,
      complete: function () {
      }
    })
  },
  delVoice: function (e) {
    var that = this
    dataService.MasterDelFiles(that.data.session, that.data.masterid, e.currentTarget.dataset.url, function (item) {
      if (item.RetCode == 0) {
        that.setData({
          succestalk: '',
          temptalk: '',
          hastalked: false,
          talkmsg: '点击开始录音',
        })
      }
    })
  },
  showPhoto: function (e) {
    var that = this
    let temp = []
    for (let i = 0; i < that.data.tempimg.length; i++) {
      temp.push(that.data.tempimg[i].url)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: temp
    })
  },
  delPhoto: function (e) {
    var that = this
    let nownum = this.data.imgnum
    let num = Number(e.currentTarget.dataset.num)
    let timg = this.data.tempimg
    timg.splice(num, 1)

    let url = e.currentTarget.dataset.url
    url = (url.substring(url.lastIndexOf("/") + 1))
    let simg = that.data.succesimg
    dataService.MasterDelFiles(that.data.session, that.data.masterid, url, function (item) {
      if (item.RetCode == 0) {
        simg = simg.replace(url + '=1|', '')
        that.setData({
          succesimg: simg,
          tempimg: timg,
          imgnum: --nownum,
        })
      }
    })
  },
  updatePhoto: function (e) {
    var that = this
    var num = that.data.imgnum;
    var cnum = 9 - num
    wx.chooseImage({
      count: cnum,
      success: function (res) {

        //new
        dataService.uploadFiles(that.data.session, that.data.masterid, 1, that.data.succesimg, res.tempFilePaths, 0, res.tempFilePaths.length, function (item) {
          that.setData({
            succesimg: item,
          })
        })

        //old

        for (let i = 0; i < res.tempFilePaths.length; i++) {
          num++;
          if (num <= 9) {
            let currentdata = that.data.tempimg;
            let data = {
              url: res.tempFilePaths[i]
            }
            currentdata.push(data)
            that.setData({
              tempimg: currentdata,
              imgnum: num
            })
          }
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      masterid: options.masterid
    })
    //获得session
    app.getSession(function (session) {
      that.setData({
        session: session
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
})