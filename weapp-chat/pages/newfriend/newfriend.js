var app = getApp()
Page({
  data:{
    list:[],
    type:true,
    focusing:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.ref = app.getDataList()
    this.ref.on('value', function(snapshot) {
        var list = snapshot.val().newfriend.list
        if(list !== null) {
            this.setData({
              list: list
            })
         }
         console.log(this.data.list)    
    }, this)
  },
  onReady:function(){
    // 页面渲染完成
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
  goPage:function(e){
      wx.navigateTo({
          url: '../message/message?name='+e.currentTarget.dataset.name+"&id="+e.currentTarget.dataset.id
      })
  }
})