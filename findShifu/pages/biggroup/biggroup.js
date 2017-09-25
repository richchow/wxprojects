var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {
    showLoading: true,
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
    ruserid: null,
    cardurl: '',
    voicelist: [],
  },
  playVideo: function (e) {
    wx.navigateTo({
      url: '/pages/playvideo/playvideo?src=' + e.currentTarget.dataset.src + '&id=' + this.data.masterid,
    })
  },
  bindToQCode: function (e) {
    wx.navigateTo({
      url: '/pages/brshare/brshare?masterid=' + e.currentTarget.dataset.masterid,
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
                    let time = Number(e.currentTarget.dataset.time) * 1000
                    setTimeout(function () {
                      wx.stopVoice()
                      vA[e.currentTarget.dataset.idx] = false
                      that.setData({ voicelist: vA })
                    }, time)
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
          if (e.detail.formId != undefined && e.detail.formId != 'the formId is a mock one') {
            dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
          }
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
        ruserid: e.currentTarget.dataset.ruserid === '' ? null : e.currentTarget.dataset.ruserid,
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
    var that = this
    wx.navigateTo({
      url: '/pages/privatelyhim/privatelyhim?masterid=' + that.data.masterid,
    })
  },
  bindDelContent: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除这条信息？',
      success: function (res) {
        if (res.confirm) {
          let index = Number(e.currentTarget.dataset.index)
          dataService.MasterDelContent(that.data.session, that.data.masterid, e.currentTarget.dataset.mrcid, function (items) {
            if (items.RetCode == 0) {
              let sfItem = that.data.sfItem
              sfItem.ltRoomInfos.splice(index, 1)
              app.getBigRoomList(that.data.masterid, function (item) {
                item.sfItems = sfItem
                app.setBigRoomList(that.data.masterid, item)
              })
              that.setData({
                sfItem: sfItem,
              })
            } else if (items.RetCode == 99) {
              app.tokenError()
            }
            else {
              app.showModal("数据错误，请稍后重试");
            }
          })
        } else if (res.cancel) {
        }
      }
    })

  },
  delcommend: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除这条信息？',
      success: function (res) {
        if (res.confirm) {
          let index = Number(e.currentTarget.dataset.index)
          let sindex = Number(e.currentTarget.dataset.sindex)
          dataService.delComment(that.data.session, e.currentTarget.dataset.mrcrid, function (items) {
            if (items.RetCode == 0) {
              let sfItem = that.data.sfItem
              sfItem.ltRoomInfos[index].ltmrcrinfos.splice(sindex, 1)
              app.getBigRoomList(that.data.masterid, function (item) {
                item.sfItems = sfItem
                app.setBigRoomList(that.data.masterid, item)
              })
              that.setData({
                sfItem: sfItem,
              })
            } else if (items.RetCode == 99) {
              app.tokenError()
            }
            else {
              app.showModal("数据错误，请稍后重试");
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  onShow: function () {
    var that = this
    let flush = false
    app.getBBflush(function(status){
      flush = status
      if (flush) {
        that.setData({
          showLoading: true
        })
        //获得session
        app.getSession(function (session) {
          that.setData({
            session: session
          })
          new app.UnreadPannel()
          that.unreadPannel.show({ token: that.data.session, requestUrl: app.getRequestUrl() })
          app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
              userInfo: userInfo
            })
          })
          dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)

          dataService.getMasterRoom(that.data.session, that.data.masterid, function (items) {
            if (items.RetCode == 0) {
              if (items.data instanceof Array) {
                if (items.data[0].userpic.indexOf('http') < 0) {
                  items.data[0].userpic = app.getRequestUrl() + 'MpicData/' + that.data.masterid + '/' + items.data[0].userpic
                }
                that.setData({
                  sfItem: items.data[0],
                  isShifu: items.data[0].iOwner == 0,
                })
              } else {
                if (items.data.userpic.indexOf('http') < 0) {
                  items.data.userpic = app.getRequestUrl() + 'MpicData/' + that.data.masterid + '/' + items.data.userpic
                }
                that.setData({
                  sfItem: items.data,
                  isShifu: items.data.iOwner == 0,
                })
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
          app.setBBflush(false)
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      masterid: options.masterid,
      appurl: app.getRequestUrl() + 'UploadedData/' + options.masterid + '/',
      cardurl: app.getRequestUrl() + 'UploadedData/',
    })
  },
  onHide: function () {
    this.unreadPannel.hiden()
  },
})