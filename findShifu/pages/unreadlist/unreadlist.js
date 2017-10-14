var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    session: '',
    userInfo: {},
    message: {},
    voicelist: [],
    showLoading:true,
  },
  playVideo: function (e) {
    wx.navigateTo({
      url: '/pages/playvideo/playvideo?src=' + e.currentTarget.dataset.src + '&id=' + e.currentTarget.dataset.id,
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
                    
                      wx.stopVoice()
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
  onLoad: function (options) {
  },

  onShow: function () {
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
      dataService.displayAlertMessage(that.data.session, function (items) {
        if (items.RetCode == 0) {
          if (items.data[0].ltContent instanceof Array) {
            for (let i in items.data[0].ltContent) {
              if (items.data[0].ltContent[i].masterpic.indexOf('http') < 0) {
                items.data[0].ltContent[i].masterpic = app.getRequestUrl() + 'MpicData/' + items.data[0].ltContent[i].masterid + '/' + items.data[0].ltContent[i].masterpic
              }
              let data = { appurl: app.getRequestUrl() + 'UploadedData/' + items.data[0].ltContent[i].masterid + '/',}
              Object.assign(items.data[0].ltContent[i],data)
            }
          }


          let vArray = new Array()
          if (that.data.sfItem != null && that.data.sfItem.ltRoomInfos.length > 0) {
            for (let si in that.data.sfItem.ltRoomInfos) {
              if (that.data.sfItem.ltRoomInfos[si].ltFilesAudio != null && that.data.sfItem.ltRoomInfos[si].ltFilesAudio.length > 0) {
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
            message: items.data[0],
          })
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
    dataService.PushUserPic(this.data.session, this.data.userInfo.nickName, this.data.userInfo.avatarUrl)
  },
  onUnload:function(){
    
    dataService.delAlertMessage(this.data.session,function(item){
    })
  }
})