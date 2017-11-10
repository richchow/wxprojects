<template>
   <div>
       <div class="weui-cells__title">{{name}}</div>
            <div class="weui-cells weui-cells_form">
                <div class="weui-cell">
                    <div class="weui-cell__bd">
                        <textarea class="weui-textarea" :placeholder="remark" @blur="updateValue($event.target.value)" rows="3"></textarea>
                    </div>
                </div>
            </div>
    </div>
</template>
<<script>
export default {
    props: {
        id: {
          type: Number,
          default: 0
        },
        name: "",
        parent:0,
        remark: ""
      },
      methods: {
        updateValue: function(value) {
          this.$emit("updateValue",this.id,this.parent,value);
        }
      }
}
</script>
<style scoped>

</style>
