// pages/profit/profit.js
Page({
  data: {
    total:0,
    pretax:0,
    initial:0,
    house: ["首套自住房", "第二套房产或投资型房产",], //房产性质 C5
    houseIndex: 0,
    yearIndex: 0,
    year: [
      {
        id:1,
        name: '第一年',
        total:
        {
          value: 600000,//房价值 C3
          sf: 40,//首付比例 C4
          mj: 800, //面积 C7
          ysyl: 4, //月租金收益率 c8
          dkll: 3.50, //贷款利率 c9
          wyf: 3, //物业费 c10
           dz: 350, //地租 c11
          yhs: 0,//印花税 C6
          yzj: 0, //月租金收益 c12
          ylx: 0, //月还款利息 c13
          ywy: 0,//月物业费 c14
          czdlf: 0, //出租代理费 c15
          ylr: 0, //租房利润/月 c16
          nlr: 0,//租房利润/年 c17
          fsz: 0, //房价上涨 c18
          nsy: 0, //年收益 c19
        }
      },
      {
        id: 2,
        name: '第二年',
        total:
        {
          value: 0,//房价值
          sf: 40,//首付比例
          mj: 800, //面积
          ysyl: 4, //月租金收益率
          dkll: 3.50, //贷款利率
          wyf: 3, //物业费
          dz: 350, //地租
          yhs: 0,//印花税
          yzj: 0, //月租金收益
          ylx: 0, //月还款利息
          ywy: 0,//月物业费
          czdlf: 0, //出租代理费
          ylr: 0, //租房利润/月
          nlr: 0,//租房利润/年
          fsz: 0, //房价上涨
          nsy: 0, //年收益
        }
      },
      {
        id: 3,
        name: '第三年',
        total:
        {
          value: 0,//房价值
          sf: 40,//首付比例
          mj: 800, //面积
          ysyl: 4, //月租金收益率
          dkll: 3.50, //贷款利率
          wyf: 3, //物业费
          dz: 350, //地租
          yhs: 0,//印花税
          yzj: 0, //月租金收益
          ylx: 0, //月还款利息
          ywy: 0,//月物业费
          czdlf: 0, //出租代理费
          ylr: 0, //租房利润/月
          nlr: 0,//租房利润/年
          fsz: 0, //房价上涨
          nsy: 0, //年收益
        }
      },
      {
        id: 4,
        name: '第四年',
        total:
        {
          value: 0,//房价值
          sf: 40,//首付比例
          mj: 800, //面积
          ysyl: 4, //月租金收益率
          dkll: 3.50, //贷款利率
          wyf: 3, //物业费
          dz: 350, //地租
          yhs: 0,//印花税
          yzj: 0, //月租金收益
          ylx: 0, //月还款利息
          ywy: 0,//月物业费
          czdlf: 0, //出租代理费
          ylr: 0, //租房利润/月
          nlr: 0,//租房利润/年
          fsz: 0, //房价上涨
          nsy: 0, //年收益
        }
      },
      {
        id: 5,
        name: '第五年',
        total:
        {
          value: 0,//房价值
          sf: 40,//首付比例
          mj: 800, //面积
          ysyl: 4, //月租金收益率
          dkll: 3.50, //贷款利率
          wyf: 3, //物业费
          dz: 350, //地租
          yhs: 0,//印花税
          yzj: 0, //月租金收益
          ylx: 0, //月还款利息
          ywy: 0,//月物业费
          czdlf: 0, //出租代理费
          ylr: 0, //租房利润/月
          nlr: 0,//租房利润/年
          fsz: 0, //房价上涨
          nsy: 0, //年收益
        }
      },
    ],
    ys: [
      { max: 125000, min: 0, sl: [0, 0.03] },
      { max: 250000, min: 125000, sl: [0.02, 0.05] },
      { max: 925000, min: 250000, sl: [0.05, 0.06] },
      { max: 1500000, min: 925000, sl: [0.1, 0.13] },
      { max: 9999999999, min: 1500000, sl: [0.12, 0.15] },
    ],
  },
  toleft: function (e) {
    let index = this.data.yearIndex
    if (index != 0) {
      this.setData({
        yearIndex: --index
      })
    }
  },
  toright: function (e) {
    let index = this.data.yearIndex
    let year = this.data.year
    if (index != this.data.year.length - 1) {
      //下一年房产价值D3=C3+C18
      year[index + 1].total.value = year[index].total.value + year[index].total.fsz
      //下一年印花税、月租金收益、月还款利息、出租代理费不变
      year[index + 1].total.yhs = year[index].total.yhs
      year[index + 1].total.yzj = year[index].total.yzj
      year[index + 1].total.ylx = year[index].total.ylx
      year[index + 1].total.czdlf = year[index].total.czdlf
      this.setData({
        yearIndex: ++index,
        year: year
      })
      this.calculation()
    }
  },
  bindKeyInput: function (e) {
    //房产市场价值 C3
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.value = num
    this.setData({
      year: year
    })
    this.yhsjs()
    this.yzjsy()
    this.yhklx()
    this.fjsz()
  },
  bindSF: function (e) {
    //首付比例 C4
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.sf = num
    this.setData({
      year: year
    })

    this.yhklx()
  },
  bindPickerChange: function (e) {
    //房产性质 C5
    this.setData({
      houseIndex: e.detail.value
    })
    this.yhsjs()
  },
  bindMJ: function (e) {
    //面积 C7
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.mj = num
    this.setData({
      year: year
    })
    this.ywyf()
  },
  bindYSYL: function (e) {
    //月租金收益率 C8
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.ysyl = num
    this.setData({
      year: year
    })
    this.yzjsy()
  },
  bindDKLL: function (e) {
    //贷款利率 C9
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.dkll = num
    this.setData({
      year: year
    })

    this.yhklx()
  },
  bindWYF: function (e) {
    //物业费 C10
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.wyf = num
    this.setData({
      year: year
    })
    this.ywyf()
  },
  bindDZ: function (e) {
    //地租 C11
    let num = Number(e.detail.value)
    let year = this.data.year
    year[this.data.yearIndex].total.dz = num
    this.setData({
      year: year
    })
    this.yzflr()
  },
  nsyf: function () {
    //年收益 C19=C17+C18
    let year = this.data.year
    year[this.data.yearIndex].total.nsy = year[this.data.yearIndex].total.fsz + year[this.data.yearIndex].total.nlr
    this.setData({
      year: year
    })
    this.pretaxf()
  },
  fjsz: function () {
    //房价上涨 C18=C3*0.08
    let year = this.data.year
    year[this.data.yearIndex].total.fsz = year[this.data.yearIndex].total.value * 0.08
    this.setData({
      year: year
    })

    this.nsyf()
  },
  yzflr: function () {
    //租房利润/月 C16=C12-C13-C14-C11/12-C15
    let year = this.data.year
    let c12 = year[this.data.yearIndex].total.yzj
    let c13 = year[this.data.yearIndex].total.ylx
    let c14 = year[this.data.yearIndex].total.ywy
    let c11 = year[this.data.yearIndex].total.dz
    let c15 = year[this.data.yearIndex].total.czdlf
    year[this.data.yearIndex].total.ylr = c12 - c13 - c14 - c11 / 12 - c15
    year[this.data.yearIndex].total.nlr = year[this.data.yearIndex].total.ylr * 12 //租房利润/年 C17=C16*12
    this.setData({
      year: year
    })

    this.nsyf()
  },
  ywyf: function () {
    //月物业费 C14=C10*C7/12
    let year = this.data.year
    year[this.data.yearIndex].total.ywy = year[this.data.yearIndex].total.mj * year[this.data.yearIndex].total.wyf / 12
    this.setData({
      year: year
    })
    this.yzflr()
  },
  yhklx: function () {
    //月还款利息 C13=C3*(1-C4)*C9/12
    let year = this.data.year
    year[this.data.yearIndex].total.ylx = year[this.data.yearIndex].total.value * (1 - (year[this.data.yearIndex].total.sf / 100)) * (year[this.data.yearIndex].total.dkll / 100) / 12
    this.setData({
      year: year
    })
    this.yzflr()
  },
  yzjsy: function () {
    //月租金收益 C12=C8*C3/12
    let year = this.data.year
    year[this.data.yearIndex].total.yzj = (year[this.data.yearIndex].total.ysyl / 100) * year[this.data.yearIndex].total.value / 12
    year[this.data.yearIndex].total.czdlf = year[this.data.yearIndex].total.yzj * 0.12 //出租代理费 C15=12%*C12
    this.setData({
      year: year
    })
    this.yzflr()
  },
  yhsjs: function () {
    //印花税 C6=C3与C5超额累进
    let year = this.data.year
    let num = this.data.year[this.data.yearIndex].total.value //房价
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
    year[this.data.yearIndex].total.yhs = total
    this.setData({
      year: year
    })
  },
  initialf:function(){
    //初始购买投资 =C3*C4+C6
    let total = this.data.year[0].total
    let initial = total.value * (total.sf / 100) + total.yhs
    this.setData({
      initial: initial
    })
  },
  pretaxf:function(){
    //年税前收益 SUM(C19:G19)
    let year = this.data.year
    let index = this.data.yearIndex
    let pretax = 0
    for(index;index >= 0;index--){
      pretax += year[index].total.nsy
    }
    this.setData({
      pretax: pretax
    })
    this.totalf()
  },
  totalf:function(){
    //年总投资收益率 =G22/(C3*C4+C6)
    let initial = this.data.initial
    let pretax = this.data.pretax
    this.setData({
      total: pretax / initial * 100
    })
  },
  calculation: function () {
    this.ywyf()
    this.fjsz()
  },
  onLoad: function (options) {
    this.yhsjs()
    this.initialf()
    this.yzjsy()
    this.yhklx()
    this.calculation()
    
  },
  onShareAppMessage: function () {

  }
})