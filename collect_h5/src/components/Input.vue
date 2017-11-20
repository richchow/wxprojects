<template>
 <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">{{item.targetname}}</label></div>
        <div class="weui-cell__bd">
        <input class="weui-input"  :placeholder="item.remark"  @input="updateValue($event.target.value)" >
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
      bus.$emit("updateValue", this.item.targetid, this.item.parentid,this.item.targetname, value);
    }
  }
};
</script>
<style scoped>
.weui-cell{
  font-size: 14px;
}
.weui-cell__hd,.weui-label{
  width:150px;
}
</style>

