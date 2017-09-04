var app = getApp()
var dataService = require('../../providers/dataService')
Page({
  data: {

  },
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene)
    console.log('route scene:', scene)
    if (scene != null) {
      let bval = scene.split(',')
      if (bval.length == 2) {
        let roomid = bval[0].split('_')
        let uid = bval[1].split('_')
        if (roomid.length == 2 && uid.length == 2) {
          app.getSession(function (session) {
            dataService.binAgent(session, uid[1], roomid[1], function (items) {
              console.log('binAgent:', items)
              if (items.RetCode == 0) {
                wx.redirectTo({
                  url: '/pages/shifu/shifu?id=' + items.data[0],
                })
              }

            })
          })
          
        }
      }
      else {
        let val = scene.split('_')
        if (val.length == 2) {
          wx.redirectTo({
            url: '/pages/passkey/passkey?id=' + val[1],
          })
        }
      }
    }
  },
})