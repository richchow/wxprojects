Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShareAppMessage: function (res) {
    return {
      title: 'BIM找机构',
      path: '/pages/use/use',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})