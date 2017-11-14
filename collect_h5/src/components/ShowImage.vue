<template>
<div v-show="showImage" class="weui-gallery" style="display: block">
      <div @click="hiddenShowImage()">
        <span class="weui-gallery__img" :style="{backgroundImage:'url(' + item.imgsrc.src + ')'}"></span>
        </div>
        <div class="weui-gallery__opr">
            <a @click="delImage($event)"  class="weui-gallery__del">
                <i class="weui-icon-delete weui-icon_gallery-delete"></i>
            </a>
        </div>
    </div>
</template>
<script>
import bus from "../assets/js/eventBus";
export default {
  data() {
    return {
      showImage: false,
      item: { id: 0, imgsrc: { id: 0, src: "" } }
    };
  },
  mounted: function() {
    let _this = this;
    bus.$on("showImage", function(item) {
      _this.showImage = true;
      _this.item = item;
    });
    bus.$on("hiddenShowImage", function() {
      _this.hiddenShowImage();
    });
  },
  methods: {
    delImage: function() {
      let that = this;
      let dialog = {
        showDialog: true,
        noDefault: false,
        handletype: "delimg",
        dialogTitle: "删除",
        dialogContent: "是否删除此图片？",
        btnPrimary: "删除",
        btnDefault: "取消",
        item:that.item,
      };
      bus.$emit("showDialog", dialog);
    },
    hiddenShowImage: function() {
      this.showImage = false;
    }
  }
};
</script>
<style scoped>

</style>

