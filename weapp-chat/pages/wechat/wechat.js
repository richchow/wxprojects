var app = getApp()
Page({
  data: {
      list: [],
      hidden: false
  },
  onReady: function() {
       this.ref = app.getDataList()
       this.ref.on('value', function(snapshot) {
           var val = snapshot.val().users;
           if(val !== null) {
              this.setData({
                 list: val,
                 hidden: true
              })
            }
      }, this)
  },
  goPage:function(e){
      var _self = this;
      var newlist = _self.data.list
      var index = e.currentTarget.dataset.index
      newlist[index].count = 0;
        _self.setData({
            list: newlist
        })
        wx.navigateTo({
            url: '../message/message?name='+e.currentTarget.dataset.name+"&id="+e.currentTarget.dataset.id
        })
  },
})
