<template>
    <div class="container">
  <div class="web-top"><div @click="toBack"><label class="web-top-back"></label>返回</div></div>
    <div class="page">
        <div id="templatestr" class="pade__bd">
          <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">采集点名称</label></div>
                    <div class="weui-cell__bd">
                        <input class="weui-input"  placeholder="请输入采集点名称" v-model="piontname"/>
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd"><label class="weui-label">采集点地址</label></div>
                    <div class="weui-cell__bd">
                        <input class="weui-input"  placeholder="请输入采集点地址" v-model="piontaddress"/>
                    </div>
                </div>
                <div class="weui-cell weui-cell_select weui-cell_select-after">
                    <div class="weui-cell__hd">
                        <label for="" class="weui-label">采集点类型</label>
                    </div>
                    <div class="weui-cell__bd">
                        <select class="weui-select" @change="selectClass($event.target.options)">
                            <option v-for="(item,index) in classlist":key="item.classid" :value="index">{{item.vClassName}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-for="item of jsonlist":key="item.classid">
              <div class="weui-cells__title" >{{item.classname}}</div>
              <div class="weui-cells weui-cells_form">
                <parentTarget :msg='item.lts' :imgtotal="imgtotal" ></parentTarget>
              </div>
            </div>
        </div>
        <a href="javascript:;" @click="submit()" class="weui-btn weui-btn_primary" :class="{'weui-btn_loading':!submitStatus}"><i v-show="!submitStatus" class="weui-loading"></i>提交</a>

    </div>
    <c-showimage ></c-showimage>
    <c-iosDialog @clPrimary="clPrimary"></c-iosDialog>
  </div>
  </template>
<script>
import bus from "../assets/js/eventBus";
import cshowimage from "./ShowImage.vue";
import ciosDialog from "./iosDialog.vue";
import cinput from "./Input.vue";
import ctextarea from "./Textarea.vue";
import cswitch from "./Switch.vue";
import cselect from "./Select.vue";
import cimage from "./Image.vue";

import dataService from "../services/DataService";
export default {
  name: "CollectDetail",
  data() {
    return {
      submitStatus: true,
      classlist: [],
      piontname: "",
      piontaddress: "",
      piontcategory: "",
      piontlatLng: {},
      inputval: [],
      dialog: {
        showDialog: false,
        noDefault: false,
        handletype: "",
        dialogTitle: "",
        dialogContent: "",
        btnPrimary: "",
        btnDefault: ""
      },
      imgtotal: 0,
      jsonlist: [
        {
          Typename: null,
          lts: [
            {
              Typename: null,
              lts: null,
              targetid: 11,
              targetname: "无障碍客房数量",
              remark: "间",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 12,
              targetname: "无障碍客房大门宽度",
              remark: "毫米",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 13,
              targetname: "无障碍房间床高",
              remark: "毫米",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 1,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 14,
              targetname: "无障碍客房卫生间门宽度",
              remark: "毫米",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              remark: [],
              targetid: 15,
              targetname: "无障碍客房卫生间马桶是否有扶手",
              lts: [
                {
                  Typename: null,
                  lts: null,
                  targetid: 111,
                  targetname: "无障碍客房数量",
                  remark: "间",
                  targettype: 1,
                  parentid: 15,
                  targetvalue: null,
                  havepic: 0,
                  picremark: null,
                  classid: null
                },
                {
                  Typename: null,
                  lts: null,
                  targetid: 112,
                  targetname: "无障碍客房数量",
                  remark: "间",
                  targettype: 1,
                  parentid: 15,
                  targetvalue: null,
                  havepic: 0,
                  picremark: null,
                  classid: null
                }
              ],
              targettype: 0,
              parentid: 10,
              targetvalue: "有|无",
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 16,
              targetname: "无障碍卫生间转角距离",
              remark: "毫米",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 17,
              targetname: "无障碍卫生间淋浴情况",
              remark: null,
              targettype: 2,
              parentid: 10,
              targetvalue: "干湿分离|浴箱|浴缸",
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 18,
              targetname: "无障碍卫生间淋浴花洒距马桶距离",
              remark: "毫米",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 0,
              picremark: null,
              classid: null
            },
            {
              Typename: null,
              lts: null,
              targetid: 19,
              targetname: "无障碍卫生间洗手池膝下空间",
              remark: "毫米",
              targettype: 1,
              parentid: 10,
              targetvalue: null,
              havepic: 1,
              picremark: null,
              classid: null
            }
          ],
          targetid: 10,
          targetname: "是否有无障碍客房",
          remark: null,
          targettype: 0,
          parentid: 0,
          targetvalue: "有|无",
          havepic: 0,
          picremark: null,
          classid: 4
        }
      ],
      imgtotal: 0
    };
  },
  components: {
    parentTarget: {
      name: "childTarget",
      template: `
      <div>
      <div v-for="item in msg":key="item.targetid">
        <c-textarea v-if="item.targettype === 3" :item="item"></c-textarea>
        <c-select v-if="item.targettype === 2" :item="item"></c-select>
        <c-switch v-if="item.targettype === 0" :item="item" @updateValue="updateValue"></c-switch>
        <c-input v-if="item.targettype === 1" :item="item" ></c-input>
        <c-image v-if="item.havepic === 1" :item="item" :imgtotal="imgtotal"></c-image>
        <childTarget :msg='item.lts' :imgtotal="imgtotal" v-if='show' ></childTarget>
      </div>
      </div>`,
      components: {
        "c-image": cimage,
        "c-textarea": ctextarea,
        "c-select": cselect,
        "c-switch": cswitch,
        "c-input": cinput
      },
      props: ["msg", "imgtotal"],
      data() {
        return {
          show: false,
          inputval: []
        };
      },
      methods: {
        updateValue: function(value) {
          if (typeof value == "boolean") {
            this.show = value;
          }
        }
      }
    },
    "c-iosDialog": ciosDialog,
    "c-showimage": cshowimage
  },
  created() {
    let that = this;
    this.piontname = this.$route.params.name;
    this.piontaddress = this.$route.params.address;
    this.piontcategory = this.$route.params.category;
    this.piontlatLng = this.$route.params.latLng;
    if (this.piontlatLng == undefined) {
      window.history.back();
    } else {
      let datas = new dataService();
      datas.getClass(function(item) {
        if (item.RetCode == 0) {
          that.classlist = item.data;
          that.jsonlist = that.classlist[0].lvc;
          that.inputval = [];
        }
      });
    }
  },
  mounted: function() {
    let that = this;
    bus.$on("updateValue", function(id, parent,name, value) {
      that.updateValue(id, parent,name, value);
    });
    bus.$on("updateImgtotal", function(value) {
      that.imgtotal = value;
    });
    bus.$on("updateImageValue", function(ctype, id, parent,name, value, src) {
      that.updateImageValue(ctype, id, parent,name, value, src);
    });
  },
  methods: {
    submit: function() {
      var that = this;
      if (this.inputval.length > 0 && this.submitStatus) {
        that.submitStatus = false;
        let target = {
          name: that.piontname,
          address: that.piontaddress,
          category: that.piontcategory,
          latLng: that.piontlatLng,
          target: that.inputval
        };
        let datas = new dataService();
        datas.setCollectionPointInfo(target, function(item) {
          if (item.RetCode == 0) {
            let dialog = {
              showDialog: true,
              noDefault: true,
              handletype: "submit",
              dialogTitle: "保存成功",
              dialogContent: "您提交的采集信息已保存成功！",
              btnPrimary: "确定",
              btnDefault: "取消"
            };
            bus.$emit("showDialog", dialog);
          } else {
            let dialog = {
              showDialog: true,
              noDefault: true,
              handletype: "default",
              dialogTitle: "保存失败",
              dialogContent: "您提交的采集信息保存失败！请稍后重试！",
              btnPrimary: "确定",
              btnDefault: "取消"
            };
            bus.$emit("showDialog", dialog);
          }
          that.submitStatus = true;
        });
      } else {
        let dialog = {
          showDialog: true,
          noDefault: true,
          handletype: "default",
          dialogTitle: "请确认",
          dialogContent: "请填写采集信息后再提交！",
          btnPrimary: "确定",
          btnDefault: "取消"
        };
        bus.$emit("showDialog", dialog);
      }
    },
    toBack: function() {
      window.history.back();
    },
    selectClass(value) {
      let curr = Number(value[value.selectedIndex].value);
      this.jsonlist = this.classlist[curr].lvc;
    },
    clPrimary: function(handletype) {
      let that = this;
      this.dialog.showDialog = false;

      if (handletype === "delimg") {
        that.showimage = false;
        bus.$emit("sureDelImg", that.imgid, that.imgsrc);
      } else if (handletype === "submit") {
        window.history.back();
      }
    },
    updateValue: function(id, parent, name,value) {
      if (typeof value == "string" && (value == "" || value == "请选择")) {
        for (let i in this.inputval) {
          if (this.inputval[i].id === id) {
            if (this.inputval[i].pic.length > 0) {
              this.inputval[i].value = "";
            } else {
              this.inputval.splice(i, 1);
            }
          }
        }
      } else if (typeof value == "boolean" && !value) {
        var i = this.inputval.length;
        while (i--) {
          if (this.inputval[i].id === id || this.inputval[i].parentid === id) {
            this.inputval.splice(i, 1);
          }
        }
      } else {
        let bo = false;
        for (let item of this.inputval) {
          if (item.id === id) {
            let obj = { value: value };
            Object.assign(item, obj);
            bo = true;
          }
        }
        if (!bo) {
          this.inputval.push({
            id: id,
            parentid: parent,
            name:name,
            value: value,
            pic: []
          });
        }
      }
      console.log("inputval", this.inputval);
    },
    updateImageValue: function(ctype, id, parent,name, value, src) {
      if (ctype == "add") {
        let bo = false;
        for (let item of this.inputval) {
          if (item.id === id) {
            let obj = { pic: value };
            Object.assign(item, obj);
            bo = true;
          }
        }
        if (!bo) {
          this.inputval.push({
            id: id,
            parentid: parent,
            name:name,
            value: "",
            pic: value
          });
        }
      }
      if (ctype == "del") {
        for (let item of this.inputval) {
          if (item.id === id) {
            for (let i in item.pic) {
              if (item.pic[i].id == src.id) {
                item.pic.splice(i, 1);
              }
            }
          }
        }
      }
      console.log("inputval", this.inputval);
    }
  }
};
</script>
<style scoped>
.page__ft {
  height: 100px;
}
.web-top {
  width: 100%;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  background-color: #1296db;
  color: #fff;
}
.web-top-back {
  margin-left: 10px;
  display: inline-block;
  border-left: 2px solid;
  border-bottom: 2px solid;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  color: #fff;
}
</style>
