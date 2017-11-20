// pages/tax/tax.js
Page({
  data: {
    inputValue: 0,
    house: ["首套自住房", "第二套房产或投资型房产",],
    houseIndex: 0,
    yhs: 0,
    lsf: 0,
    dcf: 500,
    djf: 0,
    pgf: 0,
    cpf: 0,
    jjr: 0,
    ys: [
      { max: 125000, min: 0, sl: [0, 0.03] },
      { max: 250000, min: 125000, sl: [0.02, 0.05] },
      { max: 925000, min: 250000, sl: [0.05, 0.06] },
      { max: 1500000, min: 925000, sl: [0.1, 0.13] },
      { max: 9999999999, min: 1500000, sl: [0.12, 0.15] },
    ],
    dj: [{ max: 200000, min: 0, fy: 0 },
      { max: 500000, min: 200000, fy: 135 },
      { max: 1000000, min: 500000, fy: 270 },
      { max: 9999999999, min: 1000000, fy: 445 },]
  },
  bindKeyInput: function (e) {
    let num = Number(e.detail.value)
    this.setData({
      inputValue: num,
      lsf: (num * 0.004) > 1500 ? num * 0.004 : 1500
    })
    this.yhsjs()
    this.djfjs()
  },
  bindPickerChange: function (e) {
    this.setData({
      houseIndex: e.detail.value
    })
    this.yhsjs()
  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      pgf: e.detail.value ? 0 : 400,
      cpf: e.detail.value ? 0 : 2000,
      jjr: e.detail.value ? 0 : 1000,
    })
  },
  yhsjs: function () {
    let num = this.data.inputValue //房价
    let total = 0; //印花税
    let ys = this.data.ys //印花税费率
    let sx = this.data.houseIndex //房产性质

    for (let item of ys) {
      if (num >= item.max) {
        total += (item.max - item.min) * item.sl[sx]
      } else if (num >= item.min) {
        total += (num - item.min) * item.sl[sx]
      }
    }
    this.setData({
      yhs: total
    })
  },
  djfjs: function () {
    let num = this.data.inputValue //房价
    let dj = this.data.dj
    let total = 0;
    for (let item of dj) {
      if (num <= item.max && num >= item.min) {
        total = item.fy
      } 
    }
    this.setData({
      djf: total
    })
  },
  onLoad: function (options) {

  },
  onShareAppMessage: function () {

  }
})