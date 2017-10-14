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
    isVip:-1,
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
      const downloadTask = wx.downloadFile({
        url: e.currentTarget.dataset.talk, //仅为示例，并非真实的资源
        success: function (res) {
          if (res.statusCode == 200) {
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res) {
                var savedFilePath = res.savedFilePath
                wx.playVoice({
                  filePath: savedFilePath,
                  success: function (res) {
                    
                      vA[e.currentTarget.dataset.idx] = false
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
    app.setBBflush(true)
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
      app.getiVip(function(data){
        that.setData({
          isVip: data.isVip
        })
      })
      new app.UnreadPannel()
      that.unreadPannel.show({ token: that.data.session, requestUrl: app.getRequestUrl() })
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
      dataService.getMasterListSignle(that.data.session, that.data.id, that.data.isVip, function (items) {
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
            if (that.data.sfItem.lmroominfo[si].ltFilesAudio != null && that.data.sfItem.lmroominfo[si].ltFilesAudio.length > 0) {
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
  onHide: function () {
    this.unreadPannel.hiden()
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: 'BIM找师傅',
      path: '/pages/shifu/shifu?id='+that.data.id
    }
  },
})