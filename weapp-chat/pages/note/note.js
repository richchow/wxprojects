var app = getApp()
Page({
    data:{
        noteList:[],
        list:[]
    },
    onLoad: function() {
       this.ref = app.getDataList()
       this.ref.on('value', function(snapshot) {
           var val = snapshot.val().note;
           if(val !== null) {
              this.setData({
                 noteList: val
              })
            }
      }, this)
   },
   goPage:function(e){
        var url = e.currentTarget.dataset.url;
        var name = e.currentTarget.dataset.name
        var id = e.currentTarget.dataset.id
        if(url) {
            wx.navigateTo({
             url: url
           })
        } else if (name && id) {
            wx.navigateTo({
                 url: '../message/message?name='+name+"&id="+ id
            })
        }      
    }
})