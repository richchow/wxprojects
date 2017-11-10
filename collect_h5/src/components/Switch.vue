<template>
  <div class="weui-cell weui-cell_switch">
        <div class="weui-cell__bd">{{name}}</div>
        <div class="weui-cell__ft">
        <input class="weui-switch" type="checkbox" :checked="checked"  @change="updateValue($event.target.checked)">
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
    checked: false
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
