var app = getApp()
var subRoomService = require('../../providers/subRoomService.js')
var payService = require('../../providers/payService.js')
var dataService = require('../../providers/dataService')
var inttime
var requesttime
Page({
  data: {
    showLoading: false,
    ischatpayed: false,
    iFinished: true,
    istalk: false,
    chatid: '',
    session: '',
    text: '',
    title: '',
    userInfo: {},
    message: [],//[{ id: '', text: 'huihuihiuhuihiuhiu', me: true, img: '/images/robot1.png' }, { id: '', text: 'sdfsafdadf', me: false, img: '/images/robot1.png' }],
    inputValue: '',
    messageID: 2,
    intoView: '',
    talkStatus: false,
    endday: '2017-08-03',
    appurl: app.getRequestUrl() + 'SUploadedData/',
    isLock: false,
    defpic: '/images/robot1.png',
    price: 200,
    downloadlist: [],
    isDownload: false,
    isPay: false,
  },
  bindToTalkButton: function () {
    this.setData({ istalk: true })
  },
  bindToKWButton: function () {
    this.setData({ istalk: false })
  },
  bindPayChat: function () {
    var that = this

    if (!that.data.isPay) {
      that.setData({ isPay: true })
      payService.PayforSRoom(this.data.session, this.data.chatid, this.data.price, function (item) {
        if (item.RetCode == 0) {
          that.onLoad({ id: that.data.chatid })
        } else {
          wx.showModal({
            title: '提示',
            content: '支付失败，请重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        }
        that.setData({ isPay: false })
      })
    }
  },
  playVoice: function (e) {
    var that = this
    let idx = e.currentTarget.dataset.idx
    let message = that.data.message
    if (message[idx].isPlay) {
      wx.stopVoice()
      message[idx].isPlay = false
      that.setData({ message: message })
    } else {
      wx.stopVoice()
      for (let i in message) {
        message[i].isPlay = false
      }
      message[idx].isPlay = true
      that.setData({ message: message })
      wx.playVoice({
        filePath: e.currentTarget.dataset.talk,
        success: function () {
        },
        complete: function () {
          let time = Number(e.currentTarget.dataset.time) * 1000
          setTimeout(function () {
            wx.stopVoice()
            message[idx].isPlay = false
            that.setData({ message: message })
          }, time)
        }
      })
    }
  },
  bindTalk: function () {
    var that = this
    that.setData({ talkStatus: true })
    wx.showToast({
      title: '手指上划，取消发送',
      mask: true,
      image: '/images/talk.svg',
      duration: 60000
    })
    var time = 1
    inttime = setInterval(function () { time++ }, 1000)
    wx.startRecord({
      success: function (res) {
        clearInterval(inttime)
        let temp = res.tempFilePath
        if (that.data.talkStatus) {
          wx.saveFile({
            tempFilePath: temp,
            success: function (res) {
              that.setCurrData(res.savedFilePath, '', 3, that.data.userInfo.avatarUrl, true, time, function (item) {
                subRoomService.SRPushContent(that.data.session, that.data.chatid, '', Number('3' + time), res.savedFilePath, function (items) {
                  if (items.RetCode != 0) {
                    that.syncError(item)
                  }
                })
              })

            },
            fail: function () {
              clearInterval(inttime)
              app.showModal('数据获取错误，请稍后重试')
            }
          })
        }
      },
      fail: function (res) {
        //录音失败
        clearInterval(inttime)
      }
    })
  },
  bindCanelTalk: function (e) {
    let currY = e.touches[0].pageY;
    let dataY = e.currentTarget.offsetTop;
    let abs = Math.abs(dataY - currY)
    if (abs > 50) {
      clearInterval(inttime)
      this.setData({ talkStatus: false })
      wx.showToast({
        title: '取消录音',
        mask: true,
        image: '/images/talk.svg'
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
    }
  },
  bindOverTalk: function (e) {
    clearInterval(inttime)
    wx.stopRecord()
    wx.hideToast()
  },
  showPhoto: function (e) {
    var that = this
    wx.previewImage({
      urls: [e.currentTarget.dataset.src]
    })
  },
  updatePhoto: function (e) {
    var that = this
    wx.chooseImage({
      success: function (res) {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          let temp = res.tempFilePaths[i]
          let msgID = that.data.messageID + 1;
          let currentdata = that.data.message;

          wx.saveFile({
            tempFilePath: temp,
            success: function (res) {
              that.setCurrData(res.savedFilePath, '', 1, that.data.userInfo.avatarUrl, true, 0, function (item) {
                subRoomService.SRPushContent(that.data.session, that.data.chatid, '', 1, res.savedFilePath, function (items) {
                  if (items.RetCode != 0) {
                    that.syncError(item)
                  }
                })
              })
            },
            fail: function () {
              app.showModal('数据获取错误，请稍后重试')
            }
          })

        }

      }
    })
  },
  onUnload: function () {
    clearInterval(inttime)
    clearInterval(requesttime)
    app.setDataList(this.data.chatid, this.data.message)
  },
  onReady: function () {
    this.setData({
      intoView: 'message' + this.data.messageID
    })
  },
  onShow: function () {
    var that = this
    app.getSession(function (session) {
      that.setData({
        session: session
      })
      new app.UnreadPannel()
      that.unreadPannel.show({ token: that.data.session, requestUrl: app.getRequestUrl() })
    })
  },
  onHide: function () {
    this.unreadPannel.hiden()
  },
  onLoad: function (options) {
    var that = this
    var id = options.id
    that.setData({
      chatid: id,
      showLoading: true,
    })
    if (that.data.chatid != undefined) {
      app.getSession(function (session) {
        that.setData({
          session: session
        })
        app.getUserInfo(function (userInfo) {
          that.setData({
            userInfo: userInfo
          })
        })
        app.getDataList(that.data.chatid, function (item) {
          if (item != null && item != []) {
            let obj = {
              isPlay: false
            }
            for (let i in item) {
              Object.assign(item[i], obj)
            }
          }
          that.setData({
            message: item,
            messageID: item.length,
            intoView: 'message' + (item.length - 1)
          })

          subRoomService.SRoomInfo(that.data.session, that.data.chatid, function (items) {
            if (items.RetCode == -1) {
              app.showModal('数据获取错误，请稍后重试')
            }
            else if (items.RetCode == -14) {
              wx.showModal({
                title: '提示',
                content: items.ErrorMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/group/group',
                    })
                  } else if (res.cancel) {
                  }
                }
              })

            } else if (items.RetCode == -12 || items.RetCode == -15) {
              if (items.data[0].payamount == null) {
                wx.showModal({
                  title: '提示',
                  content: '您没有房间订单，请联系师傅！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/group/group',
                      })
                    } else if (res.cancel) {
                    }
                  }
                })
              } else {
                that.setData({
                  price: Number(items.data[0].payamount),
                  title: items.data[0].title,
                })
              }

            }
            else if (items.RetCode == 0) {
              that.setData({ endday: items.data[0].enddate })
              if (items.data[0].iFinished != 0) {
                that.setData({
                  iFinished: false
                })
              }
              if (items.data[0].iOwner == 0 || items.data[0].iBuyed == 0) {
                that.setData({
                  ischatpayed: true
                })
                if (item.length > 0) {
                  let currdownloadlist = that.data.downloadlist
                  for (let i in item) {
                    if (item[i].download) {
                      currdownloadlist.push(item[i])
                    }
                  }
                  that.setData({
                    downloadlist: currdownloadlist,
                    isDownload: true,
                  })
                  if (that.data.isDownload) {
                    that.downloadFiles(that.data.downloadlist, function (item) { })
                  }

                  subRoomService.SRContent(that.data.session, that.data.chatid, function (sitems) {
                    if (sitems.RetCode == 0) {
                      that.setSyncData(sitems)
                    }
                    else if (sitems.RetCode == -1) {
                      app.showModal('数据获取错误，请稍后重试')
                    }
                  })
                }
                else {
                  subRoomService.GetSRBuffContent(that.data.session, that.data.chatid, function (sitems) {
                    if (sitems.RetCode == 0) {
                      that.setSyncData(sitems)
                    }
                    else if (sitems.RetCode == -1) {
                      app.showModal('数据获取错误，请稍后重试')
                    }
                  })
                }
                requesttime = setInterval(function () {
                  subRoomService.SRContent(that.data.session, that.data.chatid, function (sitems) {
                    if (sitems.RetCode == 0) {
                      that.setSyncData(sitems)
                    }
                    else if (sitems.RetCode == -1) {
                      app.showModal('数据获取错误，请稍后重试')
                    }
                  })
                }, 10000)
              }
              else {
                that.setData({
                  price: items.data[0].payamount
                })
              }
            }
            that.setData({ showLoading: false })
          })

        })


      })

    } else {
      app.showModal('数据错误，请返回重试')
    }
  },
  onShareAppMessage: function () {
    return {
      title: 'BIM找师傅',
      path: '/pages/find/find',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  btnSearch: function (e) {
    var that = this
    if (this.data.inputValue != null && this.data.inputValue.trim() !== '') {
      this.setCurrData(this.data.inputValue, '', 4, this.data.userInfo.avatarUrl, true, 0, function (item) {
        subRoomService.SRPushContent(that.data.session, that.data.chatid, that.data.inputValue, 4, '', function (items) {
          if (e.detail.formId != undefined && e.detail.formId != 'the formId is a mock one') {
            dataService.PushTemplateFormID(that.data.session, 1, e.detail.formId)
          }
          if (items.RetCode != 0) {
            that.syncError(item)
          }
        })
      })
      that.setData({
        inputValue: '',
      })
    }
  },
  setSyncData: function (sitems) {
    var that = this
    let srcidArray = ''
    if (sitems.data != null && sitems.data.length > 0) {

      app.getSRCRead(that.data.chatid, function (data) {
        srcidArray = data
      })
      for (let i = 0; i < sitems.data.length; i++) {
        let ctype = sitems.data[i].ctype.toString().substr(0, 1)
        switch (Number(ctype)) {
          case 4:
            that.setCurrData(sitems.data[i].mrcontent, '', sitems.data[i].ctype, sitems.data[i].uPicUrl == null ? that.data.defpic : sitems.data[i].uPicUrl, sitems.data[i].iOwner === 0, 0)
            break;
          case 1:
            that.setCurrData('/images/loading.gif', that.data.appurl + that.data.chatid + '/' + sitems.data[i].fileurl, sitems.data[i].ctype, sitems.data[i].uPicUrl == null ? that.data.defpic : sitems.data[i].uPicUrl, sitems.data[i].iOwner === 0, 0, function (item) {
              let currdownloadlist = that.data.downloadlist
              currdownloadlist.push(item)
              that.setData({
                downloadlist: currdownloadlist,
                isDownload: true,
              })
            })

            break;
          case 3:
            let second = sitems.data[i].ctype.toString().substr(1)
            that.setCurrData('/images/loading.gif', that.data.appurl + that.data.chatid + '/' + sitems.data[i].fileurl, ctype, sitems.data[i].uPicUrl == null ? that.data.defpic : sitems.data[i].uPicUrl, sitems.data[i].iOwner === 0, Number(second), function (item) {

              let currdownloadlist = that.data.downloadlist
              currdownloadlist.push(item)
              that.setData({
                downloadlist: currdownloadlist,
                isDownload: true,
              })
            })
            break;
        }

        if (sitems.data[i].iHavRead != 0) {
          srcidArray += sitems.data[i].srcid + '|'
        }
      }
    }
    if (that.data.isDownload) {
      that.downloadFiles(that.data.downloadlist, function (item) { })
    }

    if (srcidArray.length > 0) {
      if (srcidArray.lastIndexOf('|') === srcidArray.length - 1) {
        srcidArray = srcidArray.substring(0, srcidArray.lastIndexOf('|'))
      }
      subRoomService.SRContentRead(that.data.session, srcidArray, function (item) {
        if (item.RetCode === 0) {
          app.setSRCRead(that.data.chatid, '')
        }
        else if (item.RetCode == -1) {
          app.showModal('数据获取错误，请稍后重试')
        }
      })
    }
  },
  setCurrData: function (content, scontent, ctype, avatarUrl, isMe, time, cb) {
    var that = this;
    let msgID = this.data.messageID + 1;
    let currentdata = this.data.message;
    let data = {}
    switch (Number(ctype)) {
      case 4:
        data = {
          id: 'message' + msgID,
          img: avatarUrl,
          me: isMe,
          text: content,
          sync: true,
          ctype: ctype,
          download: false,
          isPlay: false,
        }
        break;
      case 1:
        data = {
          id: 'message' + msgID,
          img: avatarUrl,
          me: isMe,
          imgList: content,
          scontent: scontent,
          sync: true,
          ctype: ctype,
          download: scontent.length > 0,
          isPlay: false
        }
        break;
      case 3:
        data = {
          id: 'message' + msgID,
          img: avatarUrl,
          me: isMe,
          talk: content,
          scontent: scontent,
          time: time,
          sync: true,
          ctype: ctype,
          download: scontent.length > 0,
          isPlay: false
        }

        break;
    }
    currentdata.push(data)
    this.setData({
      message: currentdata,
      messageID: msgID,
      intoView: 'message' + this.data.messageID
    })
    typeof cb == "function" && cb(data)
  },
  editCurrData: function (msgID, content, ctype, cb) {
    var that = this;
    let currentdata = this.data.message;
    let olddata = {}
    let newdata = {}
    switch (Number(ctype)) {
      case 1:
        for (let i in currentdata) {
          if (currentdata[i].id === msgID) {
            currentdata[i].imgList = content
            currentdata[i].download = false
          }
        }
        break;
      case 3:
        for (let i in currentdata) {
          if (currentdata[i].id === msgID) {
            currentdata[i].talk = content
            currentdata[i].download = false
          }
        }
        break;
    }
    this.setData({
      message: currentdata,
    })
    typeof cb == "function" && cb('')
  },
  syncError: function (item) {
    let data = this.data.message
    let sync = item
    sync.sync = false
    for (let x in data) {
      if (data[x] === item) {
        data[x] = sync
      }
    }
  },
  downloadFiles: function (filelist, cb) {
    var that = this

    var items = { RetCode: -1, data: '数据获取错误，请稍后重试' }
    if (filelist.length > 0) {
      wx.downloadFile({
        url: filelist[0].scontent,
        success: function (res) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function (res) {
              that.editCurrData(filelist[0].id, res.savedFilePath, filelist[0].ctype, function (item) {
                filelist.shift()
              })
            },
            fail: function (res) {
            },
            complete: function () {
              that.downloadFiles(filelist, cb)
            }
          })
        },
        fail: function (res) {
        },
        complete: function () {
        }
      })
    } else {
      that.setData({
        isDownload: false,
      })
      typeof cb == "function" && cb(items)
    }
  },
})