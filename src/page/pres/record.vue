<template>
    <div class="posit">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:$t('message.head.record'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="record scoll">
                <div class="record-list">
                    <div class="record-item " :class="index===0?'start':''" v-for="(item,index) in list">
                        <div class="record-line" v-if="!item.endPoint"></div>
                        <div class="record-text">
                            <div class="record-title">
                                <i class="record-point" :class="item.endPoint?'start':''"></i> 
                                <span>{{ item.label }}</span>
                            </div>
                            <div class="record-time" v-if="item.subLabel">{{ item.subLabel }}</div>                        
                            <div class="record-time">{{ item.eventDate }}</div>
                        </div>
                    </div>
                </div>
                <div class="app-foor foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import { ajax, dateFormat, getMonday , PackageId } from '@/util/util'
    export default {
        name: 'record',
        components:{
            headTop:headTop,
            projectId: "",
        },
        data() {
            return {
                list:[1,2,3,4,5]
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.record'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            this.init();    
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
            init(){
                var params = {
                    url:"api/project/"+ this.$projectId+"/events",
                    type:"get",
                    success:res=>{
                        this._data.list = res.data.events;
                    }
                }
                ajax(params);
            }
        }
    }
</script>