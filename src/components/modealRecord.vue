<template>
    <div class="modal" v-if="modalbool">
      <div class="modalPeople bg">
        <div class="modalPeople-title">
          <span>服務記錄</span>
          <i class="modalPeople-down" @click="down" :style="{backgroundImage:'url('+require('../img/icon-cross-gray.png')+')'}"></i>
        </div>  
        <div class="serviceRecord">
          <div class="service-list">
            <div class="service-item" v-for="item in list">
              <div class="service-content">
                <div class="service-top">
                  <div class="service-top-name">日常清洁（1/12）</div>
                  <div class="service-top-enable">已评价</div>
                </div>
                <div class="service-box">
                  <div class="service-title">服务人员：</div>
                  <div class="service-text">吳小麗，李小梅</div>
                </div>
                <div class="service-box">
                  <div class="service-title">服務時段 :</div>
                  <div class="service-text">2018年8月11日，9:00 - 12:00，3小時</div>
                </div>
              </div>
              <div class="service-button" v-if='item < 10'>評價是次服務</div>
            </div>
          </div>
        </div>
      </div>            
    </div>
</template>
<script>
  import { ajax, dateFormat  } from '@/util/util';

export default {
    name: 'modealRecord',
    data(){
        return{
            modalbool: false,
            supplierId:"",
            list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
        }
    },
    mounted(){
        this.$root.eventHub.$on('showModalRecord', (supplierId) => {
            this.modalbool = true;
            // this.supplierId = supplierId;
            // this.intl(supplierId)
            // this.review(supplierId);
        });
    },
    methods: {
        intl(supplierId){
          var params = {
              url: "api/supplier/"+supplierId,
              type: 'get',
              success: res => {
                  this.peoples = res.data;
              }
          }
          ajax(params);
        },
        review(supplierId){
          var params ={
              url:"api/supplier/"+ supplierId +"/reviews?offset="+ (this.page*10) +"&limit=100",
              type:"get",
              success:res=>{
                  if(res.data.reviews){
                      var list = res.data.reviews;
                      for(let i=0; i<list.length; i++){
                          if(list[i].created){
                              if(this.$i18n.locale=="en"){
                                  list[i].created = dateFormat(list[i].created, "dd/MM/yyyy");
                              }else{
                                  list[i].created = dateFormat(list[i].created, "yyyy年MM月dd日");
                              }
                          }
                          this._data.list.push(list[i])
                      }
                      // if(res.data.reviewTimes > 10 ){
                      //   this._data.totalPage = Math.floor(res.data.reviewTimes/10);
                      //   this._data.loading = true;
                      //   this._data.height = "";
                      //   this._data.startData = true;
                      // }
                      // if(this._data.totalPage == this._data.page){
                      //   this._data.loading = false;
                      //   this._data.startData = false;                           
                      // }
                  }
              }
          }
          if(this._data.page != 0){
              params.loading = false                
          }
          ajax(params);
      },
      down(){
        this.modalbool = false;
      },
    }
}
</script>
