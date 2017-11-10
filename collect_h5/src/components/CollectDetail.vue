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
                  <div v-for="titem in item.lts":key="titem.targetid">
                      <c-textarea v-if="titem.targettype === 3" :id="titem.targetid" :name="titem.targetname" @updateValue="updateValue" :remark="titem.remark" :parent="titem.parentid"></c-textarea>
                      <c-select :name="titem.targetname" v-if="titem.targettype === 2" :id="titem.targetid" :options="titem.targetvalue" @updateSelectedValue="updateSelectedValue" :parent="titem.parentid"></c-select>
                      <c-switch :name="titem.targetname" v-if="titem.targettype === 0" :id="titem.targetid" :checked="false" @updateValue="updateValue" :parent="titem.parentid"></c-switch>
                      <c-input v-if="titem.targettype === 1" :id="titem.targetid" :name="titem.targetname" :remark="titem.remark" @updateValue="updateValue" :parent="titem.parentid"></c-input>
                      <c-image v-if="titem.havepic === 1" :id="titem.targetid" :imgtotal.sync="imgtotal" :name="titem.targetname" @showImage="showImage" @updateImageValue="updateImageValue"  :parent="titem.parentid"></c-image>
                      <div v-for="sitem in titem.lts":key="sitem.targetid">
                        <c-textarea v-if="sitem.targettype === 3" :id="stem.targetid" :name="sitem.targetname" @updateValue="updateValue" :remark="sitem.remark" :parent="sitem.parentid"></c-textarea>
                        <c-select :name="sitem.targetname" v-if="sitem.targettype === 2" :id="sitem.targetid" :options="sitem.targetvalue" @updateSelectedValue="updateSelectedValue" :parent="sitem.parentid"></c-select>
                        <c-switch :name="sitem.targetname" v-if="sitem.targettype === 0" :id="sitem.targetid" :checked="false" @updateValue="updateValue" :parent="sitem.parentid"></c-switch>
                        <c-input v-if="sitem.targettype === 1" :id="sitem.targetid" :name="sitem.targetname" :remark="sitem.remark" @updateValue="updateValue" :parent="sitem.parentid"></c-input>
                        <c-image v-if="sitem.havepic === 1" :id="sitem.targetid" :imgtotal.sync="imgtotal" :name="sitem.targetname" @showImage="showImage" :parent="sitem.parentid" @updateImageValue="updateImageValue"></c-image>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <a href="javascript:;" @click="submit()" class="weui-btn weui-btn_primary" :class="{'weui-btn_loading':!submitStatus}"><i v-show="!submitStatus" class="weui-loading"></i>提交</a>

    </div>
    <c-showimage :showimage="showimage" :imgsrc="imgsrc" :imgid="imgid" @hiddenShowImage="hiddenShowImage" @delImage="delImage" ></c-showimage>
    <c-iosDialog :showDialog="dialog.showDialog" :handletype="dialog.handletype" :noDefault="dialog.noDefault" :dialogTitle="dialog.dialogTitle" :dialogContent="dialog.dialogContent" :btnPrimary="dialog.btnPrimary" :btnDefault="dialog.btnDefault" @clDefault="clDefault" @clPrimary="clPrimary" ></c-iosDialog>
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
      imgtotal: 0,
      piontname: "",
      piontaddress: "",
      piontcategory: "",
      piontlatLng: {},
      showimage: false,
      dialog: {
        showDialog: false,
        noDefault: false,
        handletype: "",
        dialogTitle: "",
        dialogContent: "",
        btnPrimary: "",
        btnDefault: ""
      },
      imgsrc: {},
      imgid: 0,
      jsonlist: [
        {
          id: 1,
          title: "酒店外部", //区域
          target: [
            {
              id: 11,
              name: "无障碍车位",
              type: 0, //开关
              havepic: 0
            },
            {
              id: 12,
              name: "无障碍车位数量",
              remark: "请输入无障碍车位数量",
              type: 1, //输入框
              value: "",
              havepic: 1
            },
            {
              id: 13,
              name: "酒店餐厅无障碍",
              type: 2, //选择框
              options: ["能进入", "有台阶"],
              havepic: 0
            },
            {
              id: 14,
              name: "是否有贴心服务",
              remark: "提供延长杆儿 提供转移用的凳子等",
              type: 3, //多行输入框
              havepic: 1
            }
          ]
        }
      ],
      inputval: []
    };
  },
  components: {
    "c-iosDialog": ciosDialog,
    "c-showimage": cshowimage,
    "c-image": cimage,
    "c-textarea": ctextarea,
    "c-select": cselect,
    "c-switch": cswitch,
    "c-input": cinput
  },
  mounted() {
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
  methods: {
    submit: function() {
      var that = this;
      console.log(this.inputval.toString());
      if (this.inputval.length > 0 && submitStatus) {
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
            that.dialog = {
              showDialog: true,
              noDefault: true,
              handletype: "submit",
              dialogTitle: "保存成功",
              dialogContent: "您提交的采集信息已保存成功！",
              btnPrimary: "确定",
              btnDefault: "取消"
            };
          } else {
            that.dialog = {
              showDialog: true,
              noDefault: true,
              handletype: "default",
              dialogTitle: "保存失败",
              dialogContent: "您提交的采集信息保存失败！请稍后重试！",
              btnPrimary: "确定",
              btnDefault: "取消"
            };
          }
          that.submitStatus = true;
        });
      } else {
        that.dialog = {
          showDialog: true,
          noDefault: true,
          handletype: "default",
          dialogTitle: "请确认",
          dialogContent: "请填写采集信息后再提交！",
          btnPrimary: "确定",
          btnDefault: "取消"
        };
      }
    },
    showImage: function(id, imgsrc) {
      this.showimage = true;
      this.imgsrc = imgsrc;
      this.imgid = id;
    },
    hiddenShowImage: function() {
      this.showimage = false;
      this.imgsrc = {};
      this.imgid = 0;
    },
    delImage: function() {
      this.dialog = {
        showDialog: true,
        noDefault: false,
        handletype: "delimg",
        dialogTitle: "删除",
        dialogContent: "是否删除此图片？",
        btnPrimary: "删除",
        btnDefault: "取消"
      };
    },
    clDefault: function() {
      this.dialog.showDialog = false;
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
    updateValue: function(id, parent, value) {
      if (typeof value == "string" && value == "") {
        for (let i in this.inputval) {
          if (this.inputval[i].id === id) {
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
          this.inputval.push({ id: id, parentid: parent, value: value });
        }
      }
    },
    updateSelectedValue: function(id, parent, value) {
      let bo = false;
      let selectedvalue = value[value.selectedIndex].value;
      if (selectedvalue != "请选择") {
        for (let item of this.inputval) {
          if (item.id === id) {
            item.value = selectedvalue;
            bo = true;
          }
        }
        if (!bo) {
          this.inputval.push({
            id: id,
            parentid: parent,
            value: value[value.selectedIndex].value,
            pic: []
          });
        }
      } else {
        for (let i in this.inputval) {
          if (this.inputval[i].id === id) {
            this.inputval.splice(i, 1);
          }
        }
      }
    },
    updateImageValue: function(ctype, id, parent, value, src) {
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
          this.inputval.push({ id: id, parentid: parent, pic: value });
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
    },
    toBack: function() {
      window.history.back();
    },
    selectClass(value) {
      let curr = Number(value[value.selectedIndex].value);
      this.jsonlist = this.classlist[curr].lvc;
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