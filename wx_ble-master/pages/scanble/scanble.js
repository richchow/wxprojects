/**
 * 搜索设备界面
 */
Page({
  data: {
    button_text: '连接设备',
    button_type: 'primary',
    button_status: false,
    devices_data:false,
    devices_data_services:false
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;

    wx.openBluetoothAdapter({
      success: function (res) {
        // success
        console.log("初始化蓝牙适配器", res);
        wx.getBluetoothAdapterState({
          success: function (res) {
            console.log('获取本机蓝牙适配器状态', res)
            wx.onBluetoothAdapterStateChange(function (res) {
              console.log('监听蓝牙适配器状态变化时间', res)
            })
            wx.startBluetoothDevicesDiscovery({
              services: [],
              success: function (res) {
                console.log('开始搜索周边设备', res)
                that.setData({
                  button_text: '正在连接...',
                  button_type: 'default',
                  button_status: true
                })
                wx.onBluetoothDeviceFound(function (devices) {
                  console.log('发现设备', devices)
                  if (devices.name == 'A5') {
                    that.setData({
                      button_text: '断开连接',
                      button_type: 'warn',
                      devices_data: devices
                    })
                    wx.stopBluetoothDevicesDiscovery({
                      success: function (res) {
                        console.log('停止搜索周边设备', res)
                      }
                    })
                    that.link_ble_device()
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  onShow: function () {


  },
  //点击事件处理
  bindViewTap: function (e) {
    console.log(e.currentTarget.dataset.title);
    console.log(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.advertisData);

    var title = e.currentTarget.dataset.title;
    var name = e.currentTarget.dataset.name;
    wx.redirectTo({
      url: '../conn/conn?deviceId=' + title + '&name=' + name,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },



})
