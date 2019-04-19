<template>
    <div class="people posit">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:$t('message.head.people2'),start:true}"></head-top>
        
        <div class="posit" ref="people" :class="{'addTopHeight': !($alipayBool)}">
            <div class="people-stat scoll" ref="allList">
                <div class="people-top">
                    <div class="people-title">
                        <div class="people-icon" :style="{backgroundImage:'url('+require('../../img/icon-indiviual@3x.png')+')'}">
                            <img v-lazy="peoples.logoUrl" alt="">
                        </div>
                        <div class="people-user">
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
                    <div class="people-text">{{peoples.description}}</div>
                    <div class="people-phone"><a :href="'tel:'+peoples.countryCode +peoples.phone">{{$t('message.personnel.callser')}}</a></div>
                </div>
                <div class="ment-title" v-if="list.length">{{$t('message.personnel.usercomt')}}</div>
                <div class="ment-list">
                    <div class="ment-itme" v-for="item in list">
                        <div class="item-title">{{item.reviewerName}}</div>
                        <div class="ment-vice">
                            <div class="vice-icon">
                                <i class="icon-star" :class="item.rate>=1?'start':''" ></i>
                                <i class="icon-star" :class="item.rate>=2?'start':''" ></i>
                                <i class="icon-star" :class="item.rate>=3?'start':''" ></i>
                                <i class="icon-star" :class="item.rate>=4?'start':''" ></i>
                                <i class="icon-star" :class="item.rate>=5?'start':''" ></i>
                            </div>
                            <div class="vice-time">{{item.created}}</div>
                        </div>
                        <div class="ment-time">{{item.categoryLabel}}</div>
                        <div class="ment-text">{{item.review}}</div>
                    </div>
                </div>
                <div class="loading-pres" v-if="loading">
                    <div class="loading-img"></div>
                    <div class="loading-text">{{ $t("message.loading") }}...</div>
                </div>
                <div class="app-foor foor" v-else><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
        </div>             
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import { ajax, dateFormat , PackageId, getSession } from '@/util/util';
    export default {
        name: 'people',
        components:{
            headTop:headTop,
        },
        data() {
            return {
                list:[],
                peoples: {},
                supplierId: "",
                page:0,
                height:"",
                allHeight:"",
                loading:false,
                totalPage:1,
                startData:true,
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(this.$lipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.people2'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            var box = this.$refs.people; 
            this._data.allHeight = box.clientHeight;
            box.addEventListener('scroll', this.handleScroll);       
            if(this.$supplierId){
                this.supplierId = this.$supplierId;
            }else{
                this.supplierId = getSession("supplierId");
            } 
            this.review();
            this.init();
        },
        methods:{
            init(){
                var params = {
                    url: "api/supplier/"+this.supplierId,
                    type: 'get',
                    success: res => {
                        // if(res.data.logoUrl && res.data.logoUrl.indexOf('staticfiles3') >= 0) {
                        //     res.data.logoUrl = res.data.logoUrl + '!ali-m';
                        // }
                        this.peoples = res.data;
                    }
                }
                ajax(params);
            },
            review(){
                var params ={
                    url:"api/supplier/"+ this.supplierId +"/reviews?offset="+ (this.page*10) +"&limit=10",
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
                            if(res.data.reviewTimes > 10 ){
                            this._data.totalPage = Math.floor(res.data.reviewTimes/10);
                            this._data.loading = true;
                            this._data.height = "";
                            this._data.startData = true;
                            }
                            if(this._data.totalPage == this._data.page){
                            this._data.loading = false;
                            this._data.startData = false;                           
                            }
                        }
                    }
                }
                if(this._data.page != 0){
                    params.loading = false                
                }
                ajax(params);
            },
            handleScroll(){
                
                if(!this._data.height){
                    var dom = this.$refs.allList;
                    this._data.height = dom.clientHeight;
                }                      
                var box = this.$refs.people;
                var scrollTop = box.pageYOffset || box.scrollTop 
                if( scrollTop+this._data.allHeight >= this._data.height){
                    if(this._data.totalPage != this._data.page){
                        if(this._data.startData){
                            this._data.page++
                            this.review();
                            this._data.startData = false;                                                       
                        }                        
                    }
                }
            },
            changeBack(){
                this.$router.back(-1)
            },
        }
    }
</script>