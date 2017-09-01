var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    id: '',
    isMoreOpen: false,
    sfItem: null,
    appurl: '',
    cardurl: '',
    session: '',
    userInfo: {},
    showLoading: true,
    isEdit: false,
    voicelist: [],
    ispay: true,
  },
  playVideo:function(e){
    wx.navigateTo({
      url: '/pages/playvideo/playvideo?src=' + e.currentTarget.dataset.src +'&id='+this.data.id,
    })
  },
  playVoice: function (e) {
    var that = this
    let vA = that.data.voicelist
    if (vA[e.currentTarget.dataset.idx]) {
      wx.stopVoice()
      vA[e.currentTarget.dataset.idx] = false
      that.setData({ voicelist: vA })
    } else {
      vA[e.currentTarget.dataset.idx] = true
      that.setData({ voicelist: vA })
      console.log('downloadFile:', e.currentTarget.dataset.talk)
      const downloadTask = wx.downloadFile({
        url: e.currentTarget.dataset.talk, //仅为示例，并非真实的资源
        success: function (res) {
          console.log('downloadFile', 'success')
          if (res.statusCode == 200) {
            console.log('downloadFile ok:', res.tempFilePath)
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res) {
                var savedFilePath = res.savedFilePath
                console.log('savedFilePath:', savedFilePath)
                wx.playVoice({
                  filePath: savedFilePath,
                  success: function (res) {
                    console.log('res success:', savedFilePath)
                    let time = Number(e.currentTarget.dataset.time) * 1000
                    setTimeout(function () {
                      wx.stopVoice()
                      vA[e.currentTarget.dataset.idx] = false
                      that.setData({ voicelist: vA })
                    }, time)
                  },
                  fail: function () {
                    console.log('res', 'fail')
                  },
                  complete: function () {
                    console.log('res', 'complete')
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
      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      })
    }


  },
  showPhoto: function (e) {
    var that = this
    let imglist = e.currentTarget.dataset.id
    let list = []
    for (let i = 0; i < imglist.length; i++) {
      list.push(that.data.appurl + imglist[i].fileurl)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: list
    })
  },
  bindToPay: function (e) {
    var that = this
    if (that.data.ispay) {
      that.setData({ ispay: false })
      payService.PayforRoom(that.data.session, that.data.sfItem.masterid, function (items) {
        if (items.RetCode == 0) {
          console.log('pay success')
        } else if (items.RetCode == 99) {
          app.showModal("支付失败！请重试");
        } else {
          app.showModal("支付失败！请重试");
        }
        that.setData({ ispay: true })
      })
    }
  },
  bindOpenMore: function (e) {
    if (e.currentTarget.dataset.tab === '1') {
      this.setData({ isMoreOpen: false })
    } else {
      this.setData({ isMoreOpen: true })
    }
  },
  bindToEdit: function (e) {
    wx.navigateTo({
      url: '/pages/edit/edit?masterid=' + e.currentTarget.dataset.masterid,
    })
  },
  bindToBigGroup: function (e) {
    wx.navigateTo({
      url: '/pages/biggroup/biggroup?masterid=' + e.currentTarget.dataset.masterid,
    })
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      showLoading: true,
      appurl: app.getRequestUrl() + 'UploadedData/' + options.id + '/',
      cardurl: app.getRequestUrl() + 'UploadedData/',
      id: options.id,
    })

  },
  onShow: function () {
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
      dataService.getMasterListSignle(that.data.session, that.data.id, function (items) {
        if (items.RetCode == 0) {
          if (items.data[0].picurl.indexOf('http') < 0) {
            items.data[0].picurl = app.getRequestUrl() + '/MpicData/' + items.data[0].masterid + '/' + items.data[0].picurl
          }
          that.setData({
            sfItem: items.data[0],
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
        let vArray = new Array()
        if (that.data.sfItem != null && that.data.sfItem.lmroominfo != null && that.data.sfItem.lmroominfo.length > 0) {
          for (let si in that.data.sfItem.lmroominfo) {
            if (that.data.sfItem.lmroominfo.ltFilesAudio != null && that.data.sfItem.lmroominfo.ltFilesAudio.length > 0) {
              vArray.push(false)
            } else {
              vArray.push(true)
            }
          }
          that.setData({
            voicelist: vArray,
          })
        }
        that.setData({
          showLoading: false
        })
      })
    })
  },

})