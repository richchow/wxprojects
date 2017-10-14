var app = getApp()
var dataService = require('../../providers/dataService')
var inttime
Page({
  data: {
    isHuifu: false,
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
    mid: 0,
    sfItem: {},
    isShifu: false,
    isExpire: true,
    appurl: '',
    voicelist: [],
    showLoading: true,
  },
  bindToQA: function (e) {
    this.setData({
      isHuifu: true,
    })
  },
  bindCanelQA: function (e) {
    this.setData({
      isHuifu: false,
    })
  },
  formSubmit: function (e) {
    this.setData({
      loading: true
    })
    var err = true
    var that = this
    if (e.detail.value.content != ''
      || that.data.succestalk != ''
      || that.data.succesimg != '') {
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

      dataService.PushMessage(that.data.session, that.data.mid, files, e.detail.value.content, function (items) {
        if (items.RetCode == 0) {
          if (e.detail.formId != undefined && e.detail.formId != 'the formId is a mock one') {
            dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
          }
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
        dataService.MessagePushFiles(that.data.session, Number('3' + time), that.data.succestalk, new Array(res.tempFilePath), 0, 1, function (item) {
          if (item.RetCode == 0) {
            that.setData({
              succestalk: item.data,
              temptalk: temp,
              hastalked: true,
            })
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }
        })
      },
      fail: function (res) {
        //录音失败
        app.showModal("数据错误，请稍后重试");
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
  playDataVoice: function (e) {
    var that = this
    let vA = that.data.voicelist
    let idx = e.currentTarget.dataset.idx
    if (vA[idx]) {
      wx.stopVoice()
      vA[idx] = false
      that.setData({ voicelist: vA })
    } else {
      vA[idx] = true
      that.setData({ voicelist: vA })
      const downloadTask = wx.downloadFile({
        url: e.currentTarget.dataset.talk,
        success: function (res) {
          if (res.statusCode == 200) {
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res) {
                var savedFilePath = res.savedFilePath
                wx.playVoice({
                  filePath: savedFilePath,
                  success: function (res) {
                    
                      vA[idx] = false
                      that.setData({ voicelist: vA })
                    
                  },
                  fail: function () {
                  },
                  complete: function () {
                  }
                })
              }
            })

          }
          else {
            app.showModal("语音文件下载错误，请稍后重试");
          }
        }
      })
    }
  },
  delVoice: function (e) {
    var that = this
    dataService.MessageDelFiles(that.data.session, e.currentTarget.dataset.url, function (item) {
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
  showPhoto2: function (e) {
    var that = this
    let idx = e.currentTarget.dataset.idx
    let temp = []
    for (let i = 0; i < that.data.sfItem[idx].ltFilesImg.length; i++) {
      temp.push(that.data.appurl + that.data.sfItem[idx].ltFilesImg[i].fileurl)
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
    dataService.MessageDelFiles(that.data.session, url, function (item) {
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
        dataService.MessagePushFiles(that.data.session, 1, that.data.succesimg, res.tempFilePaths, 0, res.tempFilePaths.length, function (item) {
          if (item.RetCode == 0) {
            that.setData({
              succesimg: item.data,
            })
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }
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
  bindToCreateChat: function () {
    var that = this
    if (!that.data.isExpire) {
      wx.navigateTo({
        url: '/pages/createchat/createchat?userid=' + that.data.mid,
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      mid: options.mid,
    })
    var that = this
    this.setData({
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
      dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
      dataService.MessageInfo(that.data.session, that.data.mid, function (items) {
        if (items.RetCode == 0) {
          if (items.data != null && items.data.length > 0) {
            let vArray = new Array()
            for (let si in items.data) {
              if (items.data[si].ltFilesAudio != null && items.data[si].ltFilesAudio.length > 0) {
                vArray.push(false)
              } else {
                vArray.push(true)
              }
              let obj = { appurl: app.getRequestUrl() + 'MUploadedData/' + items.data[si].sender + '/'}
              Object.assign(items.data[si],obj)
              if (items.data[si].iHaveRead != 0) {
                dataService.ReadMessage(that.data.session, items.data[si].mid)
              }
            }
            that.setData({
              sfItem: items.data,
              isExpire: items.data[0].iExpire == 0,
              isShifu: items.data[0].iOwner == 0,
              voicelist: vArray,
            })
            
          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
        that.setData({
          showLoading: false
        })
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
})