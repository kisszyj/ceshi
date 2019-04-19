<template>
    <div class="pres posit">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:$t('message.head.pre'),start:true}"></head-top>
        <div class="pres-tab" :class="{'addTopHeight, addRel': !($alipayBool)}">
            <div class="pres-list">
                <div class="pres-item" :class="current == 'all'?'start':''" @click="tabClick('all')" >{{ $t('message.pre.all') }}<i class="status-icon" v-if="total"></i> <i class="botm"></i> </div>
                <div class="pres-item" :class="current == 'payment'?'start':''" @click="tabClick('payment')" >{{ $t("message.pre.payment") }}<i class="status-icon" v-if="statusicon.unpaid"></i> <i class="botm"></i></div>
                <div class="pres-item" :class="current == 'ongoing'?'start':''" @click="tabClick('ongoing')" >{{ $t("message.pre.ongoing") }}<i class="status-icon" v-if="statusicon.inprocess"></i> <i class="botm"></i></div>
                <div class="pres-item" :class="current == 'evaluate'?'start':''" @click="tabClick('evaluate')" >{{ $t("message.pre.evaluate") }}<i class="status-icon" v-if="statusicon.needReview"></i> <i class="botm"></i></div>
            </div>
            <prince :is="current" keep-alive></prince>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import all from "./all";
    import payment from "./payment";
    import ongoing from "./ongoing";
    import evaluate from "./evaluate";
    import {setCookie, getCookie,getUrlVars, setSession} from '@/util/util';
    export default {
        name: 'pres',
        data() {
            return {
                current: 'all',
                statusicon: {},
                total:"",
            };
        },
        components:{
            headTop:headTop,
            all:all,
            payment:payment,
            ongoing:ongoing,
            evaluate:evaluate,
        },
        created(){
            const { params:{lang} } = this.$route;
            if(getUrlVars().access_token || getUrlVars().tnftoken || getUrlVars().nftoken ){
                setCookie("nfcountry","HK",30)
                if(getUrlVars().access_token) {
                    setCookie("nftoken",getUrlVars().access_token,30);
                }else if(getUrlVars().tnftoken) {
                    setCookie("nftoken",getUrlVars().tnftoken,30);
                }else if(getUrlVars().nftoken) {
                    setCookie("nftoken",getUrlVars().nftoken,30);
                }
                setCookie("localeId",lang?lang:this.$i18n.locale,30);
            }

            document.getElementsByTagName('body')[0].classList.add(lang?lang:this.$i18n.locale);

            this.$i18n.locale=lang;
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.pre'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            if(this.$presTab){
                this._data.current = this.$presTab;
            }
            // this.statusicon = this.$statusicon;
            // this.total = this.totalStart(this.statusicon);            
        },
        methods:{
            changeBack(){
                let packId = "HCHOO-PKG-3";
                this.setPath(packId);
                setSession("packageId",packId)
                this.$router.push({
                    name:"index",
                    params:{lang:this.$i18n.locale}                    
                })
            },
            tabClick(tab){
                switch(tab){
                    case 'payment': 
                        this.statusicon.unpaid = false;
                        break;
                    case 'ongoing': 
                        this.statusicon.inprocess = false;
                        break;
                    case 'evaluate': 
                        this.statusicon.needReview = false;
                        break;
                }
                // this.total = this.totalStart(this.statusicon);            
                
                this._data.current = tab;
                this.setPresTab(tab);
            },
            totalStart(obj){
                for(let item  in obj){
                    if(obj[item]){
                        return true;
                    }
                }
                return false;	
            }
        },
        
    }
</script>