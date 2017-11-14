<template>
   <div>
       <div class="weui-cells__title">{{item.targetname}}</div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <textarea class="weui-textarea" :placeholder="item.remark" @input="updateValue($event.target.value)" rows="3"></textarea>
                    </div>
                </div>
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
          bus.$emit("updateValue",this.item.targetid,this.item.parentid,this.item.targetname,value);
        }
      }
}
</script>
<style scoped>

</style>
