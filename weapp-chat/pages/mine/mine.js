var app = getApp()
Page({
    data: {
        userInfo: {},
        mineList:[],
       
    },
    onLoad: function () {
        // wx.showNavigationBarLoading();
        var _self = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            _self.setData({
                userInfo:userInfo
            })
        })

       this.ref = app.getDataList()
       this.ref.on('value', function(snapshot) {
           var val = snapshot.val().mine;
           if(val !== null) {
              this.setData({
                 mineList: val
              })
            }
      }, this)
    }
})