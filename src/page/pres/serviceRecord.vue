<template>
    <div class="posit-box">
      <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:'服務記錄',start:true}"></head-top>
      <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
        <div class="serviceRecord scoll">
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
    import headTop from "../../components/headTop";
    import {setCookie, getCookie,getUrlVars, setSession} from '@/util/util';
    export default {
        name: 'serviceRecord',
        data() {
            return {
                list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
            };
        },
        components:{
            headTop:headTop,
        },
        created(){

        },
        mounted(){
           
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
        },
        
    }
</script>