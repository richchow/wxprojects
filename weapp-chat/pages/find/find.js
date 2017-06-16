var app = getApp()
Page({
    data:{
        findList:[],
    },
    onLoad: function() {
       this.ref = app.getDataList()
       this.ref.on('value', function(snapshot) {
           var val = snapshot.val().find;
           if(val !== null) {
              this.setData({
                 findList: val
              })
            }
      }, this)
  }
})