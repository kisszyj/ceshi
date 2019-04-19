<template>
    <div class="modal" v-if="modalbool">
        <div class="modalPeople">
          <div class="modalPeople-title">
            <span>{{$t('message.head.people2')}}</span>
            <i class="modalPeople-down" @click="down" :style="{backgroundImage:'url('+require('../img/icon-cross-gray.png')+')'}"></i>
          </div>
          <div class="modalPeople-box" ref="allList">
            <div class="modalPeople-top">
              <div class="modalPeople-user">
                <div class="user-avatar" :style="{backgroundImage:'url('+require('../img/icon-indiviual@3x.png')+')'}">
                    <img v-lazy="peoples.logoUrl" alt="">
                </div>
                <div class="user-right">
                  <div class="user-name">{{peoples.name}}</div>
                  <div class="user-nun">{{$t('message.personnel.service')}} {{peoples.hiredTimes}} {{$t('message.personnel.times')}}</div>
                  <div class="user-star">
                      <i class="icon-star" :class="peoples.rate>=1?'start':''" ></i>
                      <i class="icon-star" :class="peoples.rate>=2?'start':''" ></i>
                      <i class="icon-star" :class="peoples.rate>=3?'start':''" ></i>
                      <i class="icon-star" :class="peoples.rate>=4?'start':''" ></i>
                      <i class="icon-star" :class="peoples.rate>=5?'start':''" ></i>                            
                  </div>
                </div>
              </div>
              <div class="modalPeople-text">{{peoples.description}}</div>
            </div>
            <div class="review-title" v-if="list.length">{{$t('message.personnel.usercomt')}}</div>
            <div class="review-list">
              <div class="review-itme" v-for="item in list">
                  <div class="item-title">{{item.reviewerName}}</div>
                  <div class="review-vice">
                      <div class="vice-icon">
                          <i class="icon-star" :class="item.rate>=1?'start':''" ></i>
                          <i class="icon-star" :class="item.rate>=2?'start':''" ></i>
                          <i class="icon-star" :class="item.rate>=3?'start':''" ></i>
                          <i class="icon-star" :class="item.rate>=4?'start':''" ></i>
                          <i class="icon-star" :class="item.rate>=5?'start':''" ></i>
                      </div>
                      <div class="vice-time">{{item.created}}</div>
                  </div>
                  <div class="review-time">{{item.categoryLabel}}</div>
                  <div class="review-text">{{item.review}}</div>
              </div>
            </div>
            <div class="loading-pres" v-if="loading">
                <div class="loading-img"></div>
                <div class="loading-text">{{ $t("message.loading") }}...</div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
  import { ajax, dateFormat  } from '@/util/util';

export default {
    name: 'modalPeople',
    data(){
        return{
            modalbool: false,
            supplierId:"",
            peoples:{},
            list:[],
            page:0,
            height:"",
            allHeight:"",
            loading:false,
            totalPage:1,
            startData:true,
        }
    },
    mounted(){
        this.$root.eventHub.$on('showModalPeople', (supplierId) => {
            this.modalbool = true;
            this.supplierId = supplierId;
            this.intl(supplierId)
            this.review(supplierId);
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
      handleScroll(){
          if(!this._data.height){
              let dom = this.$refs.allList;
              this._data.height = dom.clientHeight;
          }                      
          let box = this.$refs.people;
          let scrollTop = box.pageYOffset || box.scrollTop 
          if( scrollTop+this._data.allHeight >= this._data.height){
              if(this._data.totalPage != this._data.page){
                  if(this._data.startData){
                      this._data.page++
                      this.review(this.supplierId);
                      this._data.startData = false;                                                       
                  }                        
              }
          }
      },
    }
}
</script>
