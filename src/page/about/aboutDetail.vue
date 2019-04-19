<template>
    <div class="posit-box" :class="{'addTopHeight': !($alipayBool) && $isMobile}">
        <head-top v-if="!$alipayBool && $isMobile"  @backClick="changeBack" v-bind:data="{title:$t('message.head.aboutDetail'),start:true}"></head-top>
        <question-head-web v-if="!$isMobile" v-bind:data="{title:$t('message.head.aboutDetail')}" ></question-head-web>
        <div class="posit">
            <div class="aboutDetail scoll" v-bind:style="mask?'overflow: hidden;':''">
                <div v-if="!$isMobile" class="aboutDetail-head">
                  <div class="aboutDetail-headTitle">{{ page_titel }}</div>
                </div>
                <div class="aboutDetail-top">
                    <div v-if="$isMobile" class="aboutDetail-title">{{ page_titel }}</div>
                    <div class="aboutDetail-list">
                        <div class="aboutDetail-item" v-for="item in questions">
                            <div class="item-title" >{{ item.shortLabel }} :</div>
                            <div class="item-text"  v-for="ite in item.answers">
                                <span v-if='item.type === "ENUMERATION" || item.type === "ADDRESS"'>{{ite.other?ite.other:ite.label}}</span>
                                <span v-if='item.type !== "ENUMERATION" && item.type !== "ADDRESS" && item.type !== "DATETIME" '>{{ite.value}}</span>
                                <span v-if='item.type !== "ENUMERATION" && item.type !== "ADDRESS" && item.type === "DATETIME"'>{{dateTime(ite.value)}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="aboutDetailWeb-bottom" v-if="!$isMobile">
                        <div class="web-back" @click="changeBack">
                            <i class="web-back-icon" :style="{backgroundImage:'url('+require('../../img/icon-arrow-left.png')+')'}"></i>
                            <span>{{ $t("message.head.fanhui") }}</span>
                        </div>
                        <div class="webBtn" @click="confirm">{{ butnLabel }}</div>
                    </div>
                </div>
                <div class="aboutDetail-price" v-if="list.length>0">
                    <div class="price-titel">{{ $t("message.about.detail") }}</div>
                    <div class="price-list">
                        <div class="price-item" v-for="item in list">
                            <div class="price-text">{{ item.itemName }}</div>
                            <div class="price-num">{{ (item.amount/100)>0?"$":"-$" }}{{ Math.abs(item.amount/100) }}</div>
                        </div>
                    </div>
                    <div class="toal-price">{{ $t("message.price.stay") }} : <span>${{(toalPrice/100)}}</span></div>
                </div>
                <div class="aboutDetail-tiaokuan" v-if="$isMobile">
                    <div class="tiaokuan-title">{{ $t("message.about.tiaokuan") }}</div>
                    <div class="tiaokuan-text">{{ $t("message.about.content") }}<a @click="maskBtn('terms_title')">{{ $t('message.about.service') }}</a>{{ $t('message.about.and') }}<a @click="maskBtn('privacy_title')">{{ $t('message.about.privacy') }}</a>{{this.$i18n.locale==='en'?'.':'。'}}</div>                
                </div>
                <div class="aboutDetail-push" v-if="$isMobile" :class="iconstart?'start':''" @click="iconStartFun">
                    <i class="ation-icon"></i>
                    <span>{{ $t("message.push.pustmeg") }}</span>
                </div>
                <div class="app-foor" v-if="$isMobile"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
                
            </div>
        </div>
        <div class="btn-box" v-if="$isMobile">
            <div class="btn" @click="confirm">{{ butnLabel }}</div>
        </div>

        <div class="mask-about" v-if="mask">
            <div class="mask-box">
                <div class="mask-top">
                    <div class="top-title">
                        <i class="mask-top-icon"></i>
                        <span>{{ maskTitel }}</span>
                    </div>
                    <div class="down" @click="down">×</div>
                </div>
                <div class="mask-scroll">
                    <div class="mask-list">
                        <div class="mask-item" v-for="(item, index) in textList" v-if="textList">
                            <p class="mask-text">{{item}}</p>
                        </div>
                    </div>
                </div>
        </div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import questionHeadWeb from "../../components/questionHeadWeb";

    import {ajax,getQuestionsAll,dateFormat,getQuestions,PackageId,getMonday,getSession , payAlipay } from "@/util/util";
    
    export default {
        name: 'aboutDetail',
        components:{
            headTop:headTop,
            questionHeadWeb:questionHeadWeb,
        },
        data() {
            return {
                list:[],
                questions:[],
                toalPrice:"",
                title:"",
                iconstart: true,
                mask:false,
                page_titel:"",
                textList:[],
                cmsData: {},
                maskTitel: "",
                termsText: "",
                butnLabel: "",
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(getSession("cmsData")){
                this.cmsData = getSession("cmsData");
            }
            if(this.$alipayBool){
                this.iconstart = false;
                this.butnLabel = this.$t('message.btn.make2');
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.aboutDetail'),
                    subtitle: ""
                });
            }else{
                this.butnLabel = this.$t('message.btn.lookprice');
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            var param = getQuestions();
            var params = getQuestionsAll(param,3);
            this.questions = params.questions;
            this.page_titel = getSession("page_titel");
            this.getData(params);
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
            // 获取数据
            getData(data){
                var params = {
                    url:"api/package/direct/"+ this.$path +"/questions",
                    data:data,
                    type:"post",
                    success:res=>{
                        if(res.data.prices){
                            this._data.list = res.data.prices[0].details;
                            this._data.toalPrice = res.data.prices[0].amount;
                        }
                    }
                }
                ajax(params)
            },
            dateTime(date){
                let str = date.split(" ");
                let da1;
                if(this.$i18n.locale=="en"){
                    da1 = dateFormat(str[0], "dd/MM/yyyy");//日期
                }else{
                    da1 = dateFormat(str[0], "yyyy年MM月dd日");//日期
                }
                let da2 = getMonday(str[0]);//星期
                let da3 = str[str.length-1];
                return da1 + " " + da2 + " " + da3;
            },
            // 提交预约
            confirm(){
                if(window.gtag){
                    window.gtag('event', 'payment-trigger', {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                    window.gtag('event', 'question-submit-clicked', {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                    window.gtag('event', 'confirm-button-clicked', {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                }            
                var param = getQuestions();
                const data = getQuestionsAll(param,this.$path);
                data.receivePromotion = this.iconstart;
                var params = {
                    url:"api/project",
                    type:"post",
                    data:data,
                    success:res=>{
                        payAlipay({
                            alipayBool:this.$alipayBool,
                            billId:res.data.billId,
                            api:process.env.API_HOST,
                            locale:this.$i18n.locale,
                            projectId:res.data.projectId,
                            errorMessage:this.$t('message.errorMessage'),
                        })
                        // let href = process.env.API_HOST+'api/alipayhk/bill/'+ res.data.billId +'/pay'
                        // window.location.href =href;
                    }
                }
                ajax(params)
            },
            iconStartFun(){
                this.iconstart = !this.iconstart;
            },
            maskBtn(title){
                this.maskTitel = this.cmsData[title]
                if(title === "privacy_title"){
                    this.textList = this.cmsData.privacy.split("\n\n");
                    this.mask = true;
                }else if(title === "terms_title"){
                    this.textList = this.cmsData.terms.split("\n\n");;
                    this.mask = true;
                }
            },
            down(){
                this.mask = false;
            },
        }
    }
</script>