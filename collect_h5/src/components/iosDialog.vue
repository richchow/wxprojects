<template>
  <div class="js_dialog" v-if="item.showDialog">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{item.dialogTitle}}</strong></div>
                <div class="weui-dialog__bd">{{item.dialogContent}}</div>
                <div class="weui-dialog__ft">
                    <a @click="clDefault" v-if="!item.noDefault" class="weui-dialog__btn weui-dialog__btn_default">{{item.btnDefault}}</a>
                    <a @click="clPrimary($event)" class="weui-dialog__btn weui-dialog__btn_primary">{{item.btnPrimary}}</a>
                </div>
            </div>
        </div>
</template>
<script>
import bus from "../assets/js/eventBus";
export default {
  data() {
    return {
      item: {
        showDialog: false,
        noDefault: false,
        handletype: "",
        dialogTitle: "",
        dialogContent: "",
        btnPrimary: "",
        btnDefault: ""
      }
    };
  },
  mounted: function() {
    let _this = this;
    bus.$on("showDialog", function(item) {
      _this.item = item;
    });
  },
  methods: {
    clDefault: function() {
      this.item.showDialog = false;
    },
    clPrimary: function(event) {
      this.item.showDialog = false;
      if(this.item.handletype == 'delimg'){
        bus.$emit("sureDelImg",this.item.item.id,this.item.item.imgsrc);
        bus.$emit("hiddenShowImage");
      }
      else if(this.item.handletype == 'submit'){
        window.history.back();
      }
       else if(this.item.handletype == 'wxsubmit'){
        wx.miniProgram.navigateTo({url: '/pages/amap/amap'})
      }
    }
  }
};
</script>
<<style scoped>

</style>


