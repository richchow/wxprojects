const app = getApp()
Page({
  data: {
    imgUrls: [
      {
        id: 1,
        name: '伦敦',
        src: '/images/ld2.png',
        checked: true,
      },
      {
        id: 2,
        name: '曼彻斯特',
        src: '/images/mcst2.png',
        checked: false,
      },
    ],
    houselist: [
      {
        id: 1,
        name: '伦敦',
        houses: [
          {
            id: 1,
            name: '伦敦泰晤士河景房—恩德格林尼治水岸Enderby Wharf',
            content: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
            src: '/images/test/主图.jpg',
          },
          {
            id: 3,
            name: '伦敦顶级学区房—哈罗广场 Harrow Square',
            content: '伦敦房产描述',
            src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 1,
            name: '伦敦泰晤士河景房—恩德格林尼治水岸Enderby Wharf',
            content: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
            src: '/images/test/主图.jpg',
          },
          {
            id: 3,
            name: '伦敦顶级学区房—哈罗广场 Harrow Square',
            content: '伦敦房产描述',
            src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
        ],
      },
      {
        id: 2,
        name: '曼彻斯特',
        houses: [
          {
            id: 2,
            name: '曼切斯特卡迪利街区豪华公寓—Oxygen',
            content: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
            src: '/images/test/主图.jpg',
          },
          {
            id: 2,
            name: '曼切斯特卡迪利街区豪华公寓—Oxygen',
            content: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
            src: '/images/test/主图.jpg',
          },
          {
            id: 2,
            name: '曼切斯特卡迪利街区豪华公寓—Oxygen',
            content: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
            src: '/images/test/主图.jpg',
          },
          {
            id: 2,
            name: '曼切斯特卡迪利街区豪华公寓—Oxygen',
            content: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
            src: '/images/test/主图.jpg',
          },
        ],
      },
    ],
    teams: [
      {
        id: 1,
        name: '伦敦房产1',
        content: '伦敦房产描述',
        src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      },
      {
        id: 3,
        name: '伦敦房产2',
        content: '伦敦房产描述',
        src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      },
    ],
    currSwiper: 0,
    userInfo: {},
  },
  changeSwiper: function (e) {
    let imgs = this.data.imgUrls;
    for (let item in imgs) {
      if (item == e.detail.current) {
        imgs[item].checked = true;
      }
      else {
        imgs[item].checked = false;
      }
    }
    imgs[e.detail.current].checked =
      this.setData({
        imgUrls: imgs,
        currSwiper: e.detail.current
      })
  },
  clChangeSwiper: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currSwiper: index
    })
  },
  clToDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  clToAbout: function (e) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {

  }
})