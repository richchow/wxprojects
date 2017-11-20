<template>
  <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <div class="weui-uploader">
                            <div class="weui-uploader__hd">
                                <p class="weui-uploader__title">图片上传 {{item.targetname}}</p>
                                <div class="weui-uploader__info">{{imgArr.length}}/4</div>
                            </div>
                            <div class="weui-uploader__bd">
                                <ul class="weui-uploader__files" id="uploaderFiles">
                                    <li class="weui-uploader__file" v-for="(imgitem, index) in imgArr":key="imgitem.id" :style="{backgroundImage:'url(' + imgitem.src + ')'}" @click="showImage(index)"></li>
                                </ul>
                                <div class="weui-uploader__input-box" v-show="imgArr.length < imgNumLimit">
                                    <input id="uploaderInput" @change="uploadImg($event)" class="weui-uploader__input" type="file" accept="image/*" multiple="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
</template>
<script>
import { EXIF } from "exif-js";
import bus from "../assets/js/eventBus";
export default {
  data() {
    return {
      imgNumLimit: 4,
      imgArr: []
    };
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    },
    imgtotal: {
      type: Number,
      default: 0
    }
  },
  computed: {
    Imgtotal: {
      get: function() {
        return this.imgtotal + 1;
      },
      set: function(v) {
        this.imgtotal = v;
      }
    }
  },
  mounted: function() {
    let _this = this;
    bus.$on("sureDelImg", function(id, src) {
      _this.delimg(id, src);
    });
  },
  methods: {
    delimg: function(id, src) {
      let _this = this;
      let bo = false;
      for (let i in _this.imgArr) {
        if (_this.imgArr[i].id == src.id) {
          _this.imgArr.splice(i, 1);
          bo = true;
        }
      }
      if (bo) {
        this.updateImageValue("del", id, 0,"", "", src);
      }
    },
    showImage: function(index) {
      let that = this;
      let item = {
        imgsrc: that.imgArr[index],
        id: that.item.targetid
      };
      bus.$emit("showImage", item);
    },
    uploadImg: function(e) {
      let tag = e.target;
      let fileList = tag.files;
      let imgNum = fileList.length;
      let _this = this;
      var total = new Number();
      total = this.Imgtotal;
      bus.$emit("updateImgtotal", total);

      if (this.imgArr.length + imgNum > this.imgNumLimit) {
        let dialog = {
          showDialog: true,
          noDefault: true,
          handletype: "default",
          dialogTitle: "错误",
          dialogContent: "一次最多上传" + this.imgNumLimit + "张图片！",
          btnPrimary: "确认",
          btnDefault: "取消"
        };
        bus.$emit("showDialog", dialog);
        return;
      }
      var Orientation;
      for (let i = 0; i < imgNum; i++) {
        EXIF.getData(fileList[i], function() {
          Orientation = EXIF.getTag(fileList[i], "Orientation");
        });
        let reader = new FileReader();
        reader.readAsDataURL(fileList[i]);
        reader.onload = function() {
          var oReader = new FileReader();
          oReader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function() {
              var expectWidth = this.naturalWidth;
              var expectHeight = this.naturalHeight;
              if (
                this.naturalWidth > this.naturalHeight &&
                this.naturalWidth > 800
              ) {
                expectWidth = 800;
                expectHeight =
                  expectWidth * this.naturalHeight / this.naturalWidth;
              } else if (
                this.naturalHeight > this.naturalWidth &&
                this.naturalHeight > 1200
              ) {
                expectHeight = 1200;
                expectWidth =
                  expectHeight * this.naturalWidth / this.naturalHeight;
              }
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              canvas.width = expectWidth;
              canvas.height = expectHeight;
              ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
              var base64 = null;
              //修复ios上传图片的时候 被旋转的问题
              if (Orientation != "" && Orientation != 1) {
                switch (Orientation) {
                  case 6: //需要顺时针（向左）90度旋转
                    _this.rotateImg(this, "left", canvas);
                    break;
                  case 8: //需要逆时针（向右）90度旋转
                    _this.rotateImg(this, "right", canvas);
                    break;
                  case 3: //需要180度旋转
                    _this.rotateImg(this, "right", canvas); //转两次
                    _this.rotateImg(this, "right", canvas);
                    break;
                }
              }
              base64 = canvas.toDataURL("image/jpeg", 0.8);
              if (fileList[i].size / 1024000 > 1) {
                _this.imgScale(base64, 4, total);
              } else {
                _this.imgArr.push({ id: _this.imgtotal, src: base64 });
                console.log("total1:", total);
                _this.updateImageValue(
                  "add",
                  _this.item.targetid,
                  _this.item.parentid,
                  _this.item.targetname,
                  _this.imgArr,
                  {}
                );
              }
            };
          };
          oReader.readAsDataURL(fileList[i]);
        };
      }
    },
    imgScale: function(imgUrl, quality) {
      let img = new Image();
      let _this = this;
      let canvas = document.createElement("canvas");
      let cxt = canvas.getContext("2d");
      img.src = imgUrl;
      img.onload = function() {
        //缩放后图片的宽高
        let width = img.naturalWidth / quality;
        let height = img.naturalHeight / quality;
        canvas.width = width;
        canvas.height = height;
        cxt.drawImage(this, 0, 0, width, height);
        _this.imgArr.push({
          id: _this.imgtotal,
          src: canvas.toDataURL("image/jpeg")
        });
        console.log("total2:", total);
        _this.updateImageValue(
          "add",
          _this.item.targetid,
          _this.item.parentid,
          _this.item.targetname,
          _this.imgArr,
          {}
        );
      };
    },
    rotateImg: function(img, direction, canvas) {
      //图片旋转
      var min_step = 0;
      var max_step = 3;
      if (img == null) return;
      var height = img.height;
      var width = img.width;
      var step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      var degree = step * 90 * Math.PI / 180;
      var ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    updateImageValue: function(ctype, id, parent,name, value, src) {
      bus.$emit("updateImageValue", ctype, id, parent,name, value, src);
    }
  }
};
</script>
<style scoped>
.weui-cell{
  font-size: 14px;
}
</style>
