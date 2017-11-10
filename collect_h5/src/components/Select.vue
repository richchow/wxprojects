<template>
  <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
        <label class="weui-label">{{name}}</label>
        </div>
        <div class="weui-cell__bd">
        <select class="weui-select" @change="updateSelectedValue($event.target.options)">
        <option v-for="option of opts":key="option" :value="option">{{option}}</option>
        </select>
        </div>
        </div>
</template>
<script>
export default {
  data() {
    return {
      opts: ['请选择']
    };
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    parent: 0,
    name: "",
    selected: "",
    options: ""
  },
  methods: {
    updateSelectedValue: function(value) {
      this.$emit("updateSelectedValue", this.id, this.parent, value);
    }
  },
  mounted: function() {
      let opt = this.options.split('|');
      for(let item of opt){
        this.opts.push(item)
      }
    }
};
</script>
<style scoped>

</style>
