var base64 = require("../../images/base64");
Page({
  data: {
    groupitems: [{ img: base64.icon20,title:'张师傅的家',new:'20'},
      { img: base64.icon20, title: '李师傅的家', new: '20' },
      { img: base64.icon20, title: '王师傅的家', new: '20' },
      { img: base64.icon20, title: '赵师傅的家', new: '20' },]
  },
  onLoad: function (options) {
    this.setData({
      icon: base64.icon20
    });
  }
})