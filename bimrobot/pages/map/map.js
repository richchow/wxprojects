var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    longitude: 0,
    latitude: 0,
    scale: 14,
    markers: [],
    polyline: [],
    controls: []
  },
  regionchange(e) {

    if (e.type === 'end') {
      console.log('regionchange:', e)
      this.getCenterLocation()
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onShareAppMessage: function () {
    return {
      title: '采集demo',
      path: '/pages/map/map',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MVZBZ-RQFWR-DHLWU-WWRRM-2DBMH-MTFIY'
    });
  },
  onReady: function (e) {
    var that = this
    wx.createSelectorQuery().select('#myMap').boundingClientRect(function (rect) {
      rect.width   // 节点的宽度
      rect.height  // 节点的高度
    }).exec(function (res) {
      console.log(res[0])
      that.setData({
        controls: [{
          id: 1,
          iconPath: '/images/marker.svg',
          position: {
            left: (res[0].width / 2) - 20,
            top: (res[0].height / 2) - 40,
            width: 40,
            height: 40
          }
        }]
      })
    })

    this.mapCtx = wx.createMapContext('myMap')
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            iconPath: "/images/marker.svg",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 20,
            height: 20
          }]
        })

      }
    })
  },
  getCenterLocation: function () {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res2) {
            console.log(res2)
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: [{
                iconPath: "/images/marker.svg",
                id: 0,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 40,
                height: 40,
                callout: {
                  content: res2.result.formatted_addresses.recommend+'[点击进行采集]',
                  borderRadius: 10,
                  bgColor: '#fff',
                  padding: 10,
                  display: 'ALWAYS'
                },
              }]
            })
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }
    })
  },
  getUserLocation: function () { },
  getClickMarket: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            iconPath: "/images/marker.svg",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 20,
            height: 20,
            callout: {
              content: res.name,
              borderRadius: 10,
              bgColor: '#fff',
              padding: 10,
              display: 'ALWAYS'
            },
          }]
        })
      }
    })
  },
  bindcallout: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/collect/collect?latitude=' + that.data.markers[0].latitude + '&longitude=' + that.data.markers[0].longitude,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})