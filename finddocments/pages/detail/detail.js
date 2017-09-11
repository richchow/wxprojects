var app = getApp()
var dataService = require('../../providers/dataService')
var payService = require('../../providers/payService')
Page({
  data: {
    showLoading: false,
    isPayed: false,
    isPaying: false,
    bottomleftBtn: 'bottomleftBtn',
    bottomleftPayingBtn: 'bottomleftPayingBtn',
    session: '',
    animationData: {},
    showModalStatus: false,
    showShareModalStatus: false,
    showModalUrlStatus: false,
    showModalInputStatus: false,
    userInfo: {},
    datainfo: {},
    loading: false,
    formVail: false,
    nameVail: '',
    ageVail: '',
    companyVail: '',
    positionVail: '',
    mobileVail: '',
    emailVail: '',
    areaVail: '',
    isQuestioned: false,
    isStarCat: false
  },
  bindToVIP: function () {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
  bindToTuli: function (e_detail_1) {
    wx.previewImage({
      urls: [app.getRequestUrl() + '/datapic/zzl/tuli.png'] // 需要预览的图片http链接列表
    })
  },
  pay: function (e) {
    if (this.data.isStarCat) {
      if (this.data.isQuestioned) {
        this.setData({
          showModalUrlStatus: true
        })
      } else {
        this.setData({
          showModalInputStatus: true
        })
      }
    } else {
      var that = this
      if(that.data.isPayed){
        that.setData({
          showModalUrlStatus: true
        })
      }else if (that.data.isPaying === false) {
        that.setData({
          isPaying: true
        })
        payService.pay(this.data.datainfo.dataid, this.data.session, function (item) {
          if (item.RetCode == 0) {
            that.setData({
              isPayed: true,
              showModalUrlStatus: true
            })
            
          } else if (item.RetCode == 99) {
            app.tokenError()
          } else {
            app.showModal("支付失败！请重试");
          }
          that.setData({
            isPaying: false
          })
        })
      }
    }
  },
  formSubmit: function (e_detail_2) {
    this.setData({
      loading: true
    })
    var err = false
    var that = this
    if (e_detail_2.detail.value.name === '') {
      err = true
      this.setData({
        nameVail: "input-error"
      })
    } else {
      this.setData({
        nameVail: ""
      })
    }
    if (e_detail_2.detail.value.age === '') {
      err = true
      this.setData({
        ageVail: "input-error"
      })
    } else {
      this.setData({
        ageVail: ""
      })
    }
    if (e_detail_2.detail.value.company === '') {
      err = true
      this.setData({
        companyVail: "input-error"
      })
    } else {
      this.setData({
        companyVail: ""
      })
    }
    if (e_detail_2.detail.value.position === '') {
      err = true
      this.setData({
        positionVail: "input-error"
      })
    } else {
      this.setData({
        positionVail: ""
      })
    }
    if (e_detail_2.detail.value.mobile === '' || !(/^1[34578]\d{9}$/.test(e_detail_2.detail.value.mobile))) {
      err = true
      this.setData({
        mobileVail: "input-error"
      })
    } else {
      this.setData({
        mobileVail: ""
      })
    }

    if (e_detail_2.detail.value.email === '' || !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e_detail_2.detail.value.email))) {
      err = true
      this.setData({
        emailVail: "input-error"
      })
    } else {
      this.setData({
        emailVail: ""
      })
    }
    if (e_detail_2.detail.value.area === '') {
      err = true
      this.setData({
        areaVail: "input-error"
      })
    } else {
      this.setData({
        areaVail: ""
      })
    }
    if (!err) {
      wx.request({
        url: app.getRequestUrl() + 'questionnaire',
        data: {
          name: e_detail_2.detail.value.name,
          age: e_detail_2.detail.value.age,
          company: e_detail_2.detail.value.company,
          position: e_detail_2.detail.value.position,
          mobile: e_detail_2.detail.value.mobile,
          email: e_detail_2.detail.value.email,
          area: e_detail_2.detail.value.area,
          tokenId: that.data.session,
          dataid: that.data.datainfo.dataid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          if (res.data.RetCode == 0) {
            that.setData({
              showModalInputStatus: false,
              showModalUrlStatus: true,
              isQuestioned: true
            })
          } else if (items.RetCode == 99) {
            app.tokenError()
          }
          else {
            app.showModal("数据错误，请稍后重试");
          }

        },
        fail: function (res) {
          app.showModal("数据错误，请稍后重试");
        },
        complete: function (res) {
          // complete
          that.setData({
            loading: false
          })
        }
      })
    } else {
      that.setData({
        loading: false
      })
    }

  },
  bindToPayed: function (e_detail_3) {
    if (this.data.isStarCat) {
      if (this.data.isQuestioned) {
        this.setData({
          showModalUrlStatus: true
        })
      } else {
        this.setData({
          showModalInputStatus: true
        })
      }
    } else {
      var sharenum = (wx.getStorageSync('sharenum') || [])
      var count = 0;
      for (var i = 0; i < sharenum.length; i++) {
        if (sharenum[i] == this.data.datainfo.dataid) {
          count++
        }
      }
      console.log(sharenum);
      console.log(" 数量为 " + count);
      if (count >= 1) {
        this.setData({
          showModalUrlStatus: true
        })
      }
      else {
        wx.showModal({
          title: '请分享本页',
          showCancel: false,
          content: '分享本页1次可查看链接',
          success: function (res) {
          }
        })
      }
    }

  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      showShareModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        showShareModalStatus: false
      })
    }.bind(this), 2000)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        showShareModalStatus: false
      })
    }.bind(this), 200)
  },
  hideUrlModal: function () {
    this.setData({
      showModalUrlStatus: false
    })
  },
  hideInputModal: function () {
    this.setData({
      showModalInputStatus: false
    })
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: this.data.datainfo.title + ' - BIM找资料',
      path: '/pages/detail/detail?id=' + this.data.datainfo.dataid,
      success: function (res) {
        // 分享成功
        var sharenum = wx.getStorageSync('sharenum') || []
        sharenum.unshift(that.data.datainfo.dataid)
        wx.setStorageSync('sharenum', sharenum)
        dataService.PushUserPic(that.data.session, that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
        dataService.putDataSharp(that.data.session, that.data.datainfo.dataid)
      }
    }
  },
  onLoad: function (options) {
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
        that.setData({
          userInfo: userInfo
        })
      })

      //获得内容详情
      dataService.getDataInfo(options.id, session, function (items) {
        if (items.RetCode == 0 || items.RetCode == -8) {
          if (items.data != null) {
            that.setData({
              datainfo: items.data[0],
              isQuestioned: true
            })
          }
          if (items.RetCode == -8) {
            that.setData({
              isQuestioned: false
            })
          }
        } else if (items.RetCode == 99) {
          app.tokenError()
        }
        if (that.data.datainfo.Buyed == 0) {
          that.setData({
            isPayed: true
          })
        }
        if (items.data != null && items.data[0].DataCatalogArry.length > 0) {
          for (var i = 0; i < items.data[0].DataCatalogArry.length; i++) {
            if (items.data[0].DataCatalogArry[i].sid == 99) {
              that.setData({ isStarCat: true })
            }
          }
        }
        setTimeout(function () {
          that.setData({
            showLoading: false
          });
        }, 2000)
      })
    })


  },
  onReady: function () {
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，为了更好的享受服务，请升级到最新微信版本后重试。'
      })
    }

  }
})