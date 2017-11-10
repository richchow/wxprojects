<template>
<div v-show="showimage" class="weui-gallery" style="display: block">
      <div @click="hiddenShowImage()">
        <span class="weui-gallery__img" :style="imgsrc.src"></span>
        </div>
        <div class="weui-gallery__opr">
            <a @click="delImage($event)"  class="weui-gallery__del">
                <i class="weui-icon-delete weui-icon_gallery-delete"></i>
            </a>
        </div>
    </div>
</template>
<script>
export default {
   props: {
        showimage: {
          type: Boolean,
          default: false
        },
        imgsrc: {
          type: Object,
          default: {}
        },
        imgid: {
          type: Number,
          default: 0
        }
      },
      methods: {
        delImage: function() {
          this.$emit("delImage");
        },
        hiddenShowImage: function() {
          this.$emit("hiddenShowImage");
        }
      }
}
</script>
<style scoped>

</style>

