var base64 = require("../../images/base64");
Page({
  data: {
    groupitems: [{ img: base64.icon20, title: '王起航回复了我', url: '20',time:'5分钟前' },
      { img: base64.icon20, title: '周先生回复了我', url: '20', time: '1天前' },]
  },
  onLoad: function (options) {
    this.setData({
      icon: base64.icon20
    });
  }
})