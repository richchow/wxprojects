var app = getApp()
var inttime
Page({
  data: {
    ischatpayed: false,
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
    talkStatus:false
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
    that.setData({ talkStatus:true})
    wx.showToast({
      title: '录音中',
      mask: true,
      image: '/images/talk.svg'
    })
    var time = 1
    inttime = setInterval(function(){time++}, 1000)
    wx.startRecord({
      success: function (res) {
        clearInterval(inttime)
        let temp = res.tempFilePath
        wx.saveFile({
          tempFilePath: temp,
          success: function (res) { 
            let msgID = that.data.messageID + 1;
            let currentdata = that.data.message;

            let data = {
              id: 'message' + msgID,
              img: that.data.userInfo.avatarUrl,
              me: true,
              talk: res.savedFilePath,
              time:time
            }
            currentdata.push(data)
            app.setDataList(that.data.chatid, data)
            that.setData({
              inputValue: "",
              message: currentdata,
              messageID: msgID
            })

            that.setData({
              intoView: 'message' + that.data.messageID
            })
          },
          fail: function () {
            clearInterval(inttime)
            app.showModal('数据获取错误，请稍后重试')
          }
        })
        
      },
      fail: function (res) {
        //录音失败
        clearInterval(inttime)
      }
    })
  },
  bindCanelTalk:function(){
    clearInterval(inttime)
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
              let data = {
                id: 'message' + msgID,
                img: that.data.userInfo.avatarUrl,
                me: true,
                imgList: res.savedFilePath
              }
              currentdata.push(data)
              app.setDataList(that.data.chatid, data)
              that.setData({
                inputValue: "",
                message: currentdata,
                messageID: msgID
              })

              that.setData({
                intoView: 'message' + that.data.messageID
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
  onReady: function () {
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
  /*    app.getSession(function (session) {
        that.setData({
          session: session
        })*/
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
        })
     /* })*/
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
      let msgID = this.data.messageID + 1;
      let currentdata = this.data.message;

      let data = {
        id: 'message' + msgID,
        img: this.data.userInfo.avatarUrl,
        me: true,
        text: this.data.inputValue,
      }
      currentdata.push(data)
      app.setDataList(this.data.chatid, data)
      this.setData({
        inputValue: "",
        message: currentdata,
        messageID: msgID
      })
    }
    this.setData({
      intoView: 'message' + this.data.messageID
    })
  }
})