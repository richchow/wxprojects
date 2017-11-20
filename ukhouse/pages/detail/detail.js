
Page({
  data: {
    currSwiper: 0,
    imgUrls: [
      {
        id: 4,
        name: '主图',
        src: 'http://www.jycloud.cc/test/oxygen.jpg',
        imgs: [
          'http://www.jycloud.cc/test/oxygen.jpg'
        ]
      },
      {
        id: 1,
        name: '内装',
        src: 'http://www.jycloud.cc/test/01.jpg',
        imgs: [
          'http://www.jycloud.cc/test/01.jpg',
          'http://www.jycloud.cc/test/02.jpg',
          'http://www.jycloud.cc/test/03.jpg',
          'http://www.jycloud.cc/test/04.jpg'
        ]
      },
      {
        id: 2,
        name: '外观',
        src: 'http://www.jycloud.cc/test/21.jpg',
        imgs: [
          'http://www.jycloud.cc/test/21.jpg',
          'http://www.jycloud.cc/test/22.jpg',
          'http://www.jycloud.cc/test/23.jpg'
        ]
      },
      {
        id: 3,
        name: '配套',
        src: 'http://www.jycloud.cc/test/11.jpg',
        imgs: [
          'http://www.jycloud.cc/test/21.jpg',
          'http://www.jycloud.cc/test/22.jpg'
        ]
      },
      
    ],
    houselist: {
      name: '曼切斯特卡迪利街区豪华公寓——Oxygen',
      desc: '两室豪华公寓仅30万英镑起；全英最高租金回报6-7%；距曼城中心火车站200米；配套氧泳池、SPA、健身房及前台。',
      content: [
        {
          name: '价格', value: '两居室30万英镑起',src:'/images/yb.png'
        },
        {
          name: '项目亮点', value: '楼盘位置绝佳，毗邻曼切斯特皮卡迪利车站，Northern Quarter以及城市中心的核心商业区，步行可至英国最大购物中心之一，Arndale购物中心。配套设施完善，整个建筑的中心位置是一个充满活力的社交中心，为住户提供了豪华的娱乐场所。该项目均按照国际高标准打造，全高挑式落地窗保证了充足的自然采光，还能俯瞰城市全景，及国家公园自然风光。',src:'/images/ld.png'
        },
        {
          name: '便利交通', value: '- 步行5分钟到达皮卡迪利火车站\n' +
          '- 步行5分钟可达皮卡迪利电车站及新伊斯灵顿电车站\n' +
          '- 开车1小时可达到伦敦市区\n' +
          '皮卡迪利电车站可通往：\n' +
          '- 皮卡迪利公园（3分钟）\n' +
          '- 市场街（6分钟）\n' +
          '- 圣彼得广场（6分钟）\n',
          src:'/images/jt.png'
        },
        {
          name: '教育资源', value: '曼城名校林立，其中大名鼎鼎的曼彻斯特大学在2017QS世界大学排名中名列全球第29，全英第7。此外，这里还有全英学生人数第二的曼彻斯特城市大学，以及皇家北方音乐学院，索尔弗德大学等。',src:'/images/jy.png'
        },
        {
          name: '配套设施', value: '24小时管家服务、天空花园、健身房、宴会厅、影院、SPA、蒸汽浴室、有氧泳池（多达3个）、Jacuzzi按摩浴缸，和包括别致阶梯形花园在内的公共户外空间。',src:'/images/gj.png'
        },
        {
          name: '项目信息', value: '产权年限：250年\n竣工日期：2018年第四季度',src:'/images/cq.png'

        },
      ]
    },
  },
  tax:function(e){
    wx.navigateTo({
      url: '/pages/tax/tax',
    })
  },
  profit: function (e) {
    wx.navigateTo({
      url: '/pages/profit/profit',
    })
  },
  showImage: function (e) {
    let idx = e.currentTarget.dataset.idx
    let imgs = this.data.imgUrls[idx]
    wx.previewImage({
      current: imgs.src,
      urls: imgs.imgs
    })
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})