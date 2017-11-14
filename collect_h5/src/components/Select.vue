<template>
  <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
        <label class="weui-label">{{item.targetname}}</label>
        </div>
        <div class="weui-cell__bd">
        <select class="weui-select" @change="updateValue($event.target.options)">
        <option v-for="option of opts":key="option" :value="option">{{option}}</option>
        </select>
        </div>
        </div>
</template>
<script>
import bus from "../assets/js/eventBus";
export default {
  data() {
    return {
      opts: ['请选择']
    };
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {targetvalue:''};
      }
    }
  },
  methods: {
    updateValue: function(value) {
       let selectedvalue = value[value.selectedIndex].value;
      bus.$emit("updateValue", this.item.targetid, this.item.parentid,this.item.targetname, selectedvalue);
    }
  },
  mounted: function() {
      let opt = this.item.targetvalue.split('|');
      for(let item of opt){
        this.opts.push(item)
      }
    }
};
</script>
<style scoped>

</style>
