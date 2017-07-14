var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    showLoading: false,
    inputValue: '',
    session: '',
    userInfo: {},
    iscommend: false,
    isShifu: false,
    commentval: '',
    masterid: 0,
    sfItem: {},
    commentid: 0,
    contentid: 0,
    appurl: '',
    rusername: '',
    ruserid:'',
    cardurl:'',
  },
  bindToQCode: function (e) {
    var that = this
    dataService.getMasterCard(that.data.session, function (item) {
      if (item.RetCode == 0) {
        const downloadTask =wx.downloadFile({
          url: that.data.cardurl+item.data[0],
          success: function (res) {
            wx.previewImage({
              current: res.tempFilePath,
              urls: [res.tempFilePath]
            })
          }
        })
        downloadTask.onProgressUpdate((res) => {
          console.log('下载进度', res.progress)
          console.log('已经下载的数据长度', res.totalBytesWritten)
          console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })
      }
    })
  },
  playVoice: function (e) {
    wx.playVoice({
      filePath: e.currentTarget.dataset.talk,
      complete: function () {
      }
    })
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
  bindToComment: function () {
    wx.navigateTo({
      url: '/pages/biggroupcomment/biggroupcomment',
    })
  },
  bindToQA: function () {
    wx.navigateTo({
      url: '/pages/biggroupqa/biggroupqa?masterid=' + this.data.masterid,
    })
  },
  bindChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  btnSearch: function (e) {
    var that = this
    if (this.data.inputValue != null && this.data.inputValue.trim() !== '') {
      dataService.PushComment(that.data.session, that.data.commentid, that.data.contentid, that.data.inputValue, function (items) {
        if (items.RetCode == 0) {
          let sf = that.data.sfItem
          for (let i = 0; i < sf.ltRoomInfos.length; i++) {
            if (sf.ltRoomInfos[i].mrcid == that.data.contentid) {
              sf.ltRoomInfos[i].ltmrcrinfos.push({
                mcontent: that.data.inputValue,
                mdate: '',
                mid: 0,
                mrcid: sf.ltRoomInfos[i].mrcid,
                mrcrid: items.data[0],
                mtime: '',
                ruserid: that.data.ruserid,
                suserid: '',
                rusername: that.data.rusername,
                susername: that.data.userInfo.nickName,
                IsMe: 0,
              })
            }
          }
          app.getBigRoomList(that.data.masterid, function (item) {
            item.sfItems = sf
            app.setBigRoomList(that.data.masterid, item)
          })
          that.setData({
              iscommend: false,
              inputValue: '',
              sfItem: sf,
            })
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        else {
          app.showModal("数据错误，请稍后重试");
        }
      })
    }

  },
  bindComment: function (e) {
    let isme = e.currentTarget.dataset.isme
    if (isme != 0) {
      this.setData({
        iscommend: true,
        commentval: e.currentTarget.dataset.val,
        commentid: e.currentTarget.dataset.commentid,
        contentid: e.currentTarget.dataset.contentid,
        rusername: e.currentTarget.dataset.rusername,
        ruserid: e.currentTarget.dataset.ruserid,
      })
    } else {
      app.showModal("无法评论自己");
    }
  },
  bindCloseComment: function (e) {
    this.setData({
      iscommend: false,
      commentval: '',
    })
  },
  bindPrivate: function (e) {
    wx.navigateTo({
      url: '/pages/privatelyhim/privatelyhim',
    })
  },
  onShow: function () {
    var that = this
    this.setData({
      showLoading: true
    })
    wx.showShareMenu({
      withShareTicket: true
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
      dataService.getMasterRoom(that.data.session, that.data.masterid, function (items) {
        if (items.RetCode == 0) {
          that.setData({
            sfItem: items.data[0],
            isShifu: items.data[0].iOwner == 0,
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
  onLoad: function (options) {
    this.setData({
      masterid: options.masterid,
      appurl: app.getRequestUrl() + 'UploadedData/' + options.masterid + '/',
      cardurl: app.getRequestUrl() + 'UploadedData/',
    })
    
  },
})