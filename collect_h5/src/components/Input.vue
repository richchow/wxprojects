<template>
 <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">{{name}}</label></div>
        <div class="weui-cell__bd">
        <input class="weui-input"  :placeholder="remark"  @blur="updateValue($event.target.value)" >
        </div>
        </div>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    name: "",
    parent: 0,
    remark: ""
  },
  methods: {
    updateValue: function(value) {
      this.$emit("updateValue", this.id, this.parent, value);
    }
  }
};
</script>
<style scoped>
</style>

