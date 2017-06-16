var app = getApp()

Page({
  data:{
    text: '',
    title: '',
    userInfo: {},
    message:[],
    animation:{},
    tap:"tapOff",
    inputValue: "",
    options:{},
    messageID: 0  
  },
  onLoad:function(options){
    var _self = this
    var messageArr = [];
    _self.setData({
        title:options.name,
        options:options
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      console.log(userInfo)
      _self.setData({
        userInfo:userInfo
      })
    })
    this.ref = app.getDataList();
    this.ref.on('value', function(snapshot) {
        var val = snapshot.val().message[options.id];
        messageArr = [];
        val.forEach(function(ele,index) {
             messageArr.push(ele)
        })
        this.setData({
            message: messageArr,
            messageID:messageArr.length
        })
    }, this)
  },
  onReady:function(){
    // 页面渲染完成
    var _self = this
    wx.setNavigationBarTitle({
        title: _self.data.title
    })
    _self.animation = wx.createAnimation();
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  bindKeyInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  send:function() {
    if(this.data.inputValue != null && this.data.inputValue.trim() !== ''){
      this.data.messageID = this.data.messageID + 1;
      var data = {};
      var options = this.data.options;
      console.log(options['id'])
      data[this.data.messageID] = {
          img:this.data.userInfo.avatarUrl,
          me:true,
          text:this.data.inputValue
      }
      this.ref.child('message').child(options.id).update(data)
      this.setData({
        inputValue: ""
      })
    }
  },
  // elseBtn:function(){
  //   var _self = this;
  //   if(_self.data.tap=="tapOff"){
  //     _self.animation_2.height("55%").step();
  //     _self.setData({ animation_2: _self.animation_2.export() })
  //     _self.setData({
  //          tap:"tapOn"
  //     })
  //   } else{
  //     _self.animation_2.height("90%").step();
  //     _self.setData({ animation_2: _self.animation_2.export() })
  //     _self.setData({
  //          tap:"tapOff"
  //     })
  //   }
  // },
  chooseImg:function(){
    var _self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表， tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths;
        var tempMessage = _self.data.message;
        tempMessage.push({
          img:_self.data.userInfo.avatarUrl,
          imgList:tempFilePaths,
          me:true
        })
        _self.setData({
          message:tempMessage
        })
      }
    })
  },
  getlocat:function(){
    var _self = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        _self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: '时代一号',
            desc: '现在的位置'
          }],
          covers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/images/green_tri.png',
            rotate: 10
          }]
        })
        var t = _self.data.message;
          t.push({
            img:_self.data.userInfo.avatarUrl,
            me:true,
            map:true
          })
          _self.setData({
            message:t
          })
    }})
      
  },
  getvoice:function(){
    console.log("开始录音")
    wx.startRecord({
      success: function(res) {
        console.log("录音成功")
        var tempFilePath = res.tempFilePath 
      },
      complete:function(res){
        console.log("complete"+res)
      },
      fail: function(res) {
        //录音失败
        console.log("fail"+res)
      }
    })
  },
  stopvoice:function(){
    wx.stopRecord()
    console.log("stop")
  }
})