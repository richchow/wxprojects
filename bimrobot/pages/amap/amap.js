const amapFile = require('../../libs/amap-wx.js');
let markersData = [];
let myAmapFun;
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    location: {},
    clickPOIs: false,
  },
  onReady: function () {
    var that = this;
    myAmapFun = new amapFile.AMapWX({ key: '3c14a0588a53c3f1cf14471e962f0404' });
    //当前坐标
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        //获得当前坐标的地图信息
        myAmapFun.getRegeo({
          iconPath: '/images/marker.png',
          iconWidth: 32,
          iconHeight: 32,
          location: location,
          success: function (data) {
            //成功回调
            console.log(data)
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: [{ //添加标记
                iconPath: "/images/marker.png",
                id: data[0].id,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 32,
                height: 32
              }],
              location: { desc: data[0].desc, name: data[0].name, pois: data[0].regeocodeData.pois }
            })
          },
          fail: function (info) {
            //失败回调
            console.log(info)
          }
        })
      }
    })
    //定义地图控件
    this.mapCtx = wx.createMapContext('map')

    //绘制地图中心点
    wx.createSelectorQuery().select('#map').boundingClientRect(function (rect) {
      rect.width   // 节点的宽度
      rect.height  // 节点的高度
    }).exec(function (res) {
      console.log(res[0])
      that.setData({
        controls: [{
          id: 1,
          iconPath: '/images/marker.png',
          position: {
            left: (res[0].width / 2) - 17,
            top: (res[0].height / 2) - 34,
            width: 32,
            height: 32
          }
        }]
      })
    })
    /*   myAmapFun.getPoiAround({
         iconPathSelected: '/images/marker.png', //如：..­/..­/img/marker_checked.png
         iconPath: '/images/marker.png', //如：..­/..­/img/marker.png
         success: function (data) {
           markersData = data.markers;
           that.setData({
             markers: markersData
           });
           that.setData({
             latitude: markersData[0].latitude
           });
           that.setData({
             longitude: markersData[0].longitude
           });
           that.showMarkerInfo(markersData, 0);
         },
         fail: function (info) {
           wx.showModal({ title: info.errMsg })
         }
       })*/
  },
  regionchange(e) {
    console.log(e.type)
    if (e.type === 'end') {
      this.getCenterLocation()
    }
  },
  getCenterLocation: function () {
    var that = this
    //重新获得当前中心点坐标
    this.mapCtx.getCenterLocation({
      success: function (res) {
        let location = res.longitude + ',' + res.latitude
        console.log(location)
        myAmapFun.getRegeo({
          iconPath: '/images/marker.png',
          iconWidth: 32,
          iconHeight: 32,
          location: location,
          success: function (data) {
            //成功回调
            console.log(data)
            that.setData({
              markers: [{ //添加标记
                iconPath: "/images/marker.png",
                id: data[0].id,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 32,
                height: 32
              }],
              location: { desc: data[0].desc, name: data[0].name, pois: data[0].regeocodeData.pois }
            })
          },
          fail: function (info) {
            //失败回调
            console.log(info)
          }
        })
      }
    })
  },
  moveToLocation: function (e) {
    this.mapCtx.moveToLocation()
  },
  clickCollect: function () {
    let that = this
    let click = this.data.clickPOIs
    this.setData({
      clickPOIs: !click
    })
    let topnum = 0
    if (this.data.clickPOIs) {
      topnum = 134
    }
    else {
      topnum = -64
    }
    //绘制地图中心点
    wx.createSelectorQuery().select('#map').boundingClientRect(function (rect) {
      rect.width   // 节点的宽度
      rect.height  // 节点的高度
    }).exec(function (res) {
      console.log(res[0])
      that.setData({
        controls: [{
          id: 1,
          iconPath: '/images/marker.png',
          position: {
            left: (res[0].width / 2) - 17,
            top: (res[0].height / 2) - topnum,
            width: 32,
            height: 32
          }
        }]
      })
    })
  },
  toCollect: function (e) {
    let name = e.currentTarget.dataset.name
    let address = e.currentTarget.dataset.address
    let types = e.currentTarget.dataset.type
    let latlng = e.currentTarget.dataset.location.split(',')
    wx.navigateTo({
      url: '/pages/web/web?name=' + name + '&address=' + address + '&category=' + types + '&lat=' + latlng[1] + '&lng=' + latlng[0],
    })
  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {

  }
})