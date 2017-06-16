var app = getApp()
var dataService = require('../../providers/dataService.js')
var payService = require('../../providers/payService.js')
Page({
  data: {
    session: '',
    loading: false,
    animationData: {},
    showModalStatus: false,
    genderarray: ['男', '女'],
    genderindex: 0,
    levelarray: [
      { name: '一级', value: '一级', checked: false},
      { name: '二级(建筑)', value: '二级(建筑)', checked: false },
      { name: '二级(结构)', value: '二级(结构)', checked: false },
      { name: '二级(机电)', value: '二级(机电)', checked: false },
    ],
    educatedarray: [
      { name: '研究生及以上', value: '研究生及以上', checked: false },
      { name: '本科', value: '本科', checked: false },
      { name: '专科', value: '专科', checked: false },
      { name: '中专', value: '中专', checked: false },
      { name: '高中', value: '高中', checked: false },
      { name: '职高', value: '职高', checked: false },
      { name: '技校', value: '技校', checked: false },
      { name: '初中', value: '初中', checked: false },
      { name: '其它', value: '其它', checked: false },
    ],
    placearray: [
      { name: '成都', value: '成都', checked: false },
      { name: '长沙', value: '长沙', checked: false },
      { name: '厦门', value: '厦门', checked: false },
    ],
    datainfo:{},
    userInfo: {},
    photo: {},
    photoStatus: false,
    qid:0,
    name: '',
    birthday: '2016-09-01',
    sex: '男',
    nativeplace: '',
    nations: '',
    level: '',
    identitycard: '',
    educated: '',
    unit: '',
    address: '',
    mobile: '',
    memberflag: false,
    place: '',
    qqid: '',
    nameVail: '',
    nativeplaceVail: '',
    nationsVail: '',
    levelVail: '',
    identitycardVail: '',
    educatedVail: '',
    unitVail: '',
    addressVail: '',
    mobile: '',
    placeVail: '',
    qqidVail: '',
    photoVail: '',
  }, 
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      loading: true
    })
    var err = false
    var that = this
    if (e.detail.value.name === '') {
      err = true
      this.setData({
        nameVail: "input-error"
      })
    } else {
      this.setData({
        nameVail: ""
      })
    }
    if (e.detail.value.nativeplace === '') {
      err = true
      this.setData({
        nativeplaceVail: "input-error"
      })
    } else {
      this.setData({
        nativeplaceVail: ""
      })
    }
    if (e.detail.value.nations === '') {
      err = true
      this.setData({
        nationsVail: "input-error"
      })
    } else {
      this.setData({
        nationsVail: "",
      })
    }
    if (e.detail.value.level === {} || e.detail.value.level.length <1) {
      err = true
      this.setData({
        levelVail: "section__title_error"
      })
    } else {
      this.setData({
        levelVail: ""
      })
    }
    if (e.detail.value.identitycard === '' || e.detail.value.identitycard.length != 18) {
      err = true
      this.setData({
        identitycardVail: "input-error"
      })
    } else {
      this.setData({
        identitycardVail: "",
        identitycard: e.detail.value.identitycard
      })
    }
    if (e.detail.value.educated === '' || e.detail.value.educated.length <1) {
      err = true
      this.setData({
        educatedVail: "section__title_error"
      })
    } else {
      this.setData({
        educatedVail: "",
        educated: e.detail.value.educated
      })
    }
    if (e.detail.value.unit === '') {
      err = true
      this.setData({
        unitVail: "input-error"
      })
    } else {
      this.setData({
        unitVail: "",
        unit: e.detail.value.unit
      })
    }
    if (e.detail.value.address === '') {
      err = true
      this.setData({
        addressVail: "input-error"
      })
    } else {
      this.setData({
        addressVail: "",
        address: e.detail.value.address
      })
    }
    if (e.detail.value.mobile === '' || !(/^1[34578]\d{9}$/.test(e.detail.value.mobile))) {
      err = true
      this.setData({
        mobileVail: "input-error"
      })
    } else {
      this.setData({
        mobileVail: ""
      })
    }
    if (e.detail.value.place === '' || e.detail.value.place.length <1) {
      err = true
      this.setData({
        placeVail: "section__title_error"
      })
    } else {
      this.setData({
        placeVail: "",
        place: e.detail.value.place
      })
    }
    if (e.detail.value.qqid === '') {
      err = true
      this.setData({
        qqidVail: "input-error"
      })
    } else {
      this.setData({
        qqidVail: "",
        qqid: e.detail.value.qqid
      })
    }
    if(that.data.photo.length == undefined ||that.data.photo.length <1){
      err = true
      this.setData({
        photoVail: "section__title_error"
      })
    } else {
      this.setData({
        photoVail: ""
      })
    }
    if (err) {
      app.showModal("填写信息有误，请检查所填信息项！")
      that.setData({
        loading: false
      })
    } else { 
      dataService.postEnroll(e.detail.value,that.data.photo,that.data.session,function(item){
        if (item.RetCode == 0) {
          that.setData({
            qid:item.data[0]
          })
          payService.pay(that.data.qid,that.data.session,function(payitem){
            if (payitem.RetCode == 0) {
              wx.navigateTo({
                url: '/pages/enroll/enroll'
              })
            } else if (payitem.RetCode == 99) {
              app.tokenError()
            } else {
              app.showModal("支付失败！请重试");
            }
            that.setData({
              loading: false
            })
          })
        } else if (items.RetCode == 99) {
          app.tokenError()
          that.setData({
            loading: false
          })
        } else if (item.RetCode == 98) {
          app.showModal(item.ErrorMsg);
          that.setData({
            loading: false
          })
        }
        else {
          app.showModal("数据错误，请稍后重试");
          that.setData({
            loading: false
          })
        }
      })
    }
  },
  updatePhoto: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({
          photo: res.tempFilePaths[0],
          photoStatus: true
        })
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(res.width)
            console.log(res.height)
          }
        })
      }
    })
  },
  showPhoto: function (e) {
    var that = this
    wx.previewImage({
      urls: [that.data.photo]
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      genderindex: e.detail.value,
      sex: genderarray[e.detail.value]
    })
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
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
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
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  onShareAppMessage: function () {
    return {
      title: 'BIMd代报名',
      path: '/pages/enrolldetail/enrolldetail'
    }
  },
  onLoad: function () {
    console.log('Index onLoad')
    var today = new Date().toLocaleDateString().split('/').join('-')
    this.setData({
      birthday: today
    })
    
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
    })
   
  }
})
