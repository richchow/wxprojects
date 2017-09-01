var app = getApp()
Page({

  data: {
    src: '',
  },

  onLoad: function (options) {
    var that = this
    if (options.src != null) {
      app.getTempVideolist(function (item) {
        let list = item
        let curr = ''
        if (list != null) {
          for (let i in list) {
            if (list[i].url === options.src) {
              curr = list[i].temp
            }
          }
        }
        if (curr === '') {
          wx.downloadFile({
            url: app.getRequestUrl() + 'UploadedData/' + options.id + '/' + options.src,
            success: function (res) {
              that.setData({
                src: res.tempFilePath
              })
              let temp = {
                url: options.src,
                temp: res.tempFilePath
              }
              list.push(temp)
              app.setTempVideolist(list)
            }
          })
        } else {
          that.setData({
            src: curr
          })
        }

      })
    }
  },
})