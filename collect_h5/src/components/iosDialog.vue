<template>
  <div class="js_dialog" v-if="showDialog">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{dialogTitle}}</strong></div>
                <div class="weui-dialog__bd">{{dialogContent}}</div>
                <div class="weui-dialog__ft">
                    <a @click="clDefault" v-if="!noDefault" class="weui-dialog__btn weui-dialog__btn_default">{{btnDefault}}</a>
                    <a @click="clPrimary($event)" :handletype="handletype" class="weui-dialog__btn weui-dialog__btn_primary">{{btnPrimary}}</a>
                </div>
            </div>
        </div>
</template>
<script>
export default {
  props: {
    handletype:{
      type:String,
      default:""
    },
      showDialog:{
          type:Boolean,
          default:false
      },
    noDefault: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ""
    },
    dialogContent: {
      type: String,
      default: ""
    },
    btnPrimary: {
      type: String,
      default: ""
    },
    btnDefault: {
      type: String,
      default: ""
    }
  },
  methods: {
    clDefault: function() {
      this.$emit("clDefault");
    },
    clPrimary: function(event) {
      this.$emit("clPrimary",this.handletype);
    }
  }
};
</script>
<<style scoped>

</style>


