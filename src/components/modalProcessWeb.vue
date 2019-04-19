<template>
    <div class="modal" v-if="modalbool">
      <div class="modalPeople bg">
        <div class="modalPeople-title">
          <span>{{process.service_flow_title}}</span>
          <i class="modalPeople-down" @click="down" :style="{backgroundImage:'url('+require('../img/icon-cross-gray.png')+')'}"></i>
        </div>  
        <div class="serviceRecord process">
          <div class="process-prompt" v-if="process.service_flow_description">{{process.service_flow_description}}</div>
          <div class="process-itme" v-for="(item, index) in process.cleaning_step">
              <div class="process-title">
                  <img class="process-icon" v-lazy="item.image" alt="" v-if="item.image">
                  <div class="title-text">{{item.title}}</div>
              </div>
              <div class="process-text" v-for="ite in item.description">
                  <i></i>
                  <span>{{ite}};</span>
              </div>
          </div>
        </div>
      </div>            
    </div>
</template>
<script>
  import { ajax  } from '@/util/util';

export default {
    name: 'modalProcessWeb',
    data(){
        return{
            modalbool: false,
            process:"",
        }
    },
    mounted(){
        this.$root.eventHub.$on('showModalProcess', (packageNumber) => {
            this.modalbool = true;
            this.getCms(packageNumber)
        });
    },
    methods: {
      getCms(packageNumber){
        let _this = this;
        var params = {
            url:"cms/prismic/alipay/direct-service?packageId="+ packageNumber+"&locale="+ this.$i18n.locale,
            type:"get",
            success:res=>{
                this._data.process = res.result;
            }
        }
        ajax(params, true);
      },
      down(){
        this.modalbool = false;
      },
    }
}
</script>
