<template>
    <div class="bookingHeadWeb">
        <div class="booking-head-bg">
          <div class="booking-head">
            <div class="booking-logo logo" :style="{backgroundImage:'url('+require('../img/hellotoby-logo-white.png')+')'}"></div>
            <div class="booking-user">
                <div class="booking-title">{{data.title}}</div>
            </div>
          </div>
        </div>
        <div class="booking-back-bg" v-if="data.back">
          <div class="booking-back">
            <div class="booking-back-btn" @click="back">
            <i :style="{backgroundImage:'url('+require('../img/icon-red-left.png')+')'}"></i>
            <span>{{ $t("message.head.fanhui") }}</span>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:"bookingHeadWeb",
        props:["data"],
        data(){
            return{
                total:"",
            }
        },
        mounted(){
            setTimeout(() => {
                this.total = this.totalStart(this.$statusicon);  
            },500);
        },
        methods:{
            back(){
                this.$emit("backClick")
            },
            totalStart(obj){
                for(let item  in obj){
                    if(obj[item]){
                        return true;
                    }
                }
                return false;	
            }
        }


    }

</script>