<template>
    <div class="modal" v-if="modalbool" v-on:click.stop="down">
        <div class="mobileSelect" v-on:click.stop>
            <div class="mobileSelect-title">評價服務</div>
            <div class="mobileSelect-list">
              <div class="mobileSelect-item" v-for="(item, index) in schedules" v-on:click.stop="selectOpten(item)">
                <div class="mobileSelect-date">{{item.startDate}}</div>
                <div class="mobileSelect-text">
                  <span>服務人員：</span>
                  <span v-for="(supplier, index) in item.suppliers">
                    {{supplier.name}}
                    <span v-if="item.suppliers.length-1 !== index">，</span>                    
                  </span>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'mobileSelect',
    props:{
        schedules:{
          type: Array,
          default: []
        },
    },
    data(){
        return{
            modalbool:false,
        }
    },
    mounted(){
        this.$root.eventHub.$on('showSelect', () => {
            this.modalbool = true;
        });
    },
    methods: {
      selectOpten(item){
        this.$emit('changeSelect',item);
        this.modalbool = false;
      },
      down(){
        this.modalbool = false;
      }
    }
}
</script>
