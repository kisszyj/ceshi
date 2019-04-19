<template>
    <div class="head">
        <div class="head-left" @click="back" v-if=" data.start ">
            <img src="../img/bank.png" alt="">
            <span>   {{ $t("message.head.fanhui") }}</span>
        </div>
        <div class="head-left" v-else></div>
        <div class="head-content">{{ data.title }}</div>
        <div class="head-rigth" v-if="data.right" @click="preClick">{{$t('message.head.pre')}}<i v-if="total" class="status-icon"></i></div>
        <div class="head-rigth" v-else></div>
    </div>
</template>
<script>
    export default {
        name:"headTop",
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
            preClick(){
                this.$emit("preClick")                
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