<template>
    <div class="complete posit">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.head.complete'),start:true}"></head-top>
        <div class="complete-box">
            <div class="complete-icon"></div>
            <div class="complete-title">{{ $t('message.complete.title') }}</div>
            <div class="complete-text">{{ $t('message.complete.text') }}</div>
            <div class="complete-btn" @click="completeBtn">{{ $t('message.complete.btn') }}</div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import { setSession, getUrlVars, PackageId, setCookie} from '@/util/util'
    export default {
        name: 'complete',
        data(){
            return {
                projectId: "",
            }
        },
        components:{
            headTop:headTop,
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang, projectId} } = this.$route;
            this.$i18n.locale=lang;
            this.projectId = projectId;
            this.setProjectId(projectId);
            setSession("projectId", projectId);
            // setCookie("nfcountry","HK",30)
            // if(getUrlVars().access_token){
            //     setCookie("nftoken",getUrlVars().access_token,30)
            // }
            // setCookie("localeId",lang?lang:this.$i18n.locale,30)

            document.getElementsByTagName('body')[0].classList.add(lang?lang:this.$i18n.locale)        
            
            if(!lang){
                this.$router.push({name: 'index', params: {lang:lang?lang:this.$i18n.locale}});             
            }
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.complete'),
                    subtitle: ""
                }); 
            }
        },
        mounted() {
            const { path } = this.$route;
            this.gaGoogle(path);
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
            // 返回到服务器
            completeBtn(){
                let billId = this.projectId;
                var actionArr = window.location.href.split("#");
                var action = actionArr[0];
                location.replace(action+"#/"+this.$i18n.locale+"/presDeta/"+billId);
                // this.$router.push({
                //     name:"presDeta",
                //     params: {lang: this.$i18n.locale, projectId: billId},                    
                // }) 
                // this.$router.push({
                //     name:"pres",
                //     params: {lang: this.$i18n.locale},                    
                // })
            },
        }
    }
</script>