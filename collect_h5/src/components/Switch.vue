<template>
  <div class="weui-cell weui-cell_switch">
        <div class="weui-cell__bd">{{item.targetname}}</div>
        <div class="weui-cell__ft">
        <input class="weui-switch" type="checkbox"  @change="updateValue($event.target.checked)">
        </div>
  </div>
</template>
<script>
import bus from "../assets/js/eventBus";
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit("updateValue", value);
      bus.$emit("updateValue",this.item.targetid, this.item.parentid,this.item.targetname, value)
    }
  }
};
</script>
<style scoped>
.weui-cell{
  font-size: 14px;
}
</style>
