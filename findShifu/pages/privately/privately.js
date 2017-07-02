var base64 = require("../../images/base64");
Page({
  data: {
    groupitems: [{ img: base64.icon20, title: '王起航私信了我', url: '/pages/privatelyqa/privatelyqa', time: '5分钟前' },
      { img: base64.icon20, title: '周先生私信了我', url: '/pages/privatelyqa/privatelyqa', time: '1天前' },]
  },
  onLoad: function (options) {
    this.setData({
      icon: base64.icon20
    });
  }
})