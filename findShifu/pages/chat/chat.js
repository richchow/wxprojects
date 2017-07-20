var app = getApp()
var subRoomService = require('../../providers/subRoomService.js')
var inttime
Page({
  data: {
    ischatpayed: false,
    iFinished: true,
    istalk: false,
    chatid: '',
    session: '',
    text: '',
    title: '',
    userInfo: {},
    message: [{ id: '', text: 'huihuihiuhuihiuhiu', me: true, img: '/images/robot1.png' }, { id: '', text: 'sdfsafdadf', me: false, img: '/images/robot1.png' }],
    inputValue: '',
    messageID: 2,
    intoView: '',
    talkStatus: false,
    endday: '2017-08-03',
    appurl: app.getRequestUrl() + 'SUploadedData/',
    isLock: false,
  },
  bindToTalkButton: function () {
    this.setData({ istalk: true })
  },
  bindToKWButton: function () {
    this.setData({ istalk: false })
  },
  bindPayChat: function () {
    this.setData({ ischatpayed: true })
  },
  playVoice: function (e) {
    wx.playVoice({
      filePath: e.currentTarget.dataset.talk,
      complete: function () {
      }
    })
  },
  bindTalk: function () {
    var that = this
    that.setData({ talkStatus: true })
    wx.showToast({
      title: '录音中',
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
              that.setCurrData(res.savedFilePath, 3, this.data.userInfo.avatarUrl, true, time, function (item) {
                subRoomService.SRPushContent(that.data.session, '', 3, saveFilePath, function (items) {
                  if (items.RetCode == 0) {
                    that.setSData(item)
                  }
                  else {
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
  bindCanelTalk: function () {
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
  },
  bindOverTalk: function () {
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
              subRoomService.SRPushContent(that.data.session, '', 1, saveFilePath, function (items) {
                if (items.RetCode == 0) {
                  that.setCurrData(res.savedFilePath, 1, this.data.userInfo.avatarUrl, true, 0)
                }
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
  onHide:function(){
    app.setDataList(that.data.chatid, that.data.message)
  },
  onUnload:function(){
    app.setDataList(that.data.chatid,that.data.message)
  },
  onReady: function() {
    console.log('onReady')
    this.setData({
      intoView: 'message' + this.data.messageID
    })
  },
  onLoad: function (options) {
    console.log('chat:', options.id)
    var that = this
    var id = options.id
    if (id != undefined) {
      that.setData({ chatid: id })
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
          console.log(item)
          that.setData({
            message: item,
            messageID: item.length,
            intoView: 'message' + (item.length - 1)
          })

          subRoomService.SRoomInfo(that.data.session, that.data.chatid, function (items) {
            if (items.RetCode == -12) {
              wx.redirectTo({
                url: '/pages/group/group',
              })
            } else if (items.RetCode == 0) {
              if (items.data[0].iFinished != 0) {
                that.setData({
                  iFinished: false
                })
              }
              if (items.data[0].iOwner == 0 || items.data[0].isBuyed == 0) {
                that.setData({
                  ischatpayed: true
                })
                if (item.length > 0) {
                  subRoomService.SRContent(that.data.session, that.data.chatid, function (sitems) {
                    if (sitems.RetCode == 0) {
                      if (sitems.data != null && sitems.data.length > 0) {
                        for (let i = 0; i < sitems.data.length; i++) {
                          switch (sitems.data[i].ctype) {
                            case 4:
                              that.setCurrData(sitems.data[i].content, sitems.data[i].ctype, sitems.data[i].avatarUrl, false, 0)
                              break;
                            case 1:
                              wx.saveFile({
                                tempFilePath: sitems.data[i].image,
                                success: function (res) {
                                  that.setCurrData(res.savedFilePath, sitems.data[i].ctype, sitems.data[i].avatarUrl, false, 0)
                                }
                              })
                              break;
                            case 3:
                              wx.saveFile({
                                tempFilePath: sitems.data[i].audio,
                                success: function (res) {
                                  that.setCurrData(res.savedFilePath, sitems.data[i].ctype, sitems.data[i].avatarUrl, false, 0)
                                }
                              })
                              break;
                          }
                        }
                      }
                    }
                  })
                }
                else {
                  subRoomService.GetSRBuffContent(that.data.session, thatd.data.chatid, function (sitems) {
                    if (sitems.RetCode == 0) {
                      if (sitems.data != null && sitems.data.length > 0) {
                        for (let i = 0; i < sitems.data.length; i++) {
                          switch (sitems.data[i].ctype) {
                            case 4:
                              that.setCurrData(sitems.data[i].content, sitems.data[i].ctype, sitems.data[i].avatarUrl, false, 0)
                              break;
                            case 1:
                              wx.saveFile({
                                tempFilePath: sitems.data[i].image,
                                success: function (res) {
                                  that.setCurrData(res.savedFilePath, sitems.data[i].ctype, sitems.data[i].avatarUrl, false, 0)
                                }
                              })
                              break;
                            case 3:
                              wx.saveFile({
                                tempFilePath: sitems.data[i].audio,
                                success: function (res) {
                                  that.setCurrData(res.savedFilePath, sitems.data[i].ctype, sitems.data[i].avatarUrl, false, 0)
                                }
                              })
                              break;
                          }
                        }
                      }
                    }
                  })
                }
              }
              else {
                that.setData({
                  price: items.data[0].price
                })
              }
            }
          })

        })


      })
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
  btnSearch: function () {
    if (this.data.inputValue != null && this.data.inputValue.trim() !== '') {
      subRoomService.SRPushContent(that.data.session, '', 1, saveFilePath, function (items) {
        if (items.RetCode == 0) {
          this.setCurrData(this.data.inputValue, 4, this.data.userInfo.avatarUrl, true)
        }
      })
    }
  },
  setCurrData: function (content, ctype, avatarUrl, isMe, time, cb) {
    var that = this;
    let msgID = this.data.messageID + 1;
    let currentdata = this.data.message;
    let data = {}
    switch (ctype) {
      case 4:
        data = {
          id: 'message' + msgID,
          img: avatarUrl,
          me: isMe,
          text: content,
          sync: true,
        }
        break;
      case 1:
        data = {
          id: 'message' + msgID,
          img: avatarUrl,
          me: isMe,
          imgList: content,
          sync: true,
        }
        break;
      case 3:
        data = {
          id: 'message' + msgID,
          img: avatarUrl,
          me: isMe,
          talk: res.savedFilePath,
          time: time,
          sync: true,
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
})