<template>
    <div class="payment posit" ref="payment">
        <scroll-notice v-if="notice" v-bind:data="{text:notice,}" ></scroll-notice>
        <div class="all-box">
            <div class="payment-list" ref="allList">
                <div class="all-itme" v-for="item in listorder" @click="presDeta(item.id)">
                    <div class="itme-title">{{item.categoryLabel}}<i v-if="item.lastNewEvent" class="lastnew">N</i></div>
                    <div class="itme-text">{{item.address}}</div>
                    <div class="itme-text">{{item.datetime}}</div>
                    <div class="itme-foor">
                        <div class="foor-box"> 
                            <div class="foot-text">
                            <span> {{ $t('message.order.increase') }} </span>
                            <i></i> 
                            </div>
                            <div class="foor-btn">
                                <div class="foorBtn" v-on:click.stop="payment(item.bills)">{{ $t('message.order.payment') }}</div>                          
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="loading-pres" v-if="loading">
                <div class="loading-img"></div>
                <div class="loading-text">{{ $t("message.loading") }}...</div>
            </div>
            <div class="app-foor foor" v-else><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
        </div>
    </div>
</template>
<script>
    import { ajax, dateFormat, getMonday , PackageId, getSession, setSession , payAlipay } from '@/util/util'
    import scrollNotice from "../../components/scrollNotice"
    export default {
        name: 'payment',
        data() {
            return {
                listorder: [],
                page:0,
                totalPage:0,
                height:"",
                allHeight:"",
                loading:false,
                startData:true,
                notice:"",
            };
        },
        components:{
            scrollNotice: scrollNotice
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            this.init();
            var box = this.$refs.payment;
            this._data.allHeight = box.clientHeight;            
            box.addEventListener('scroll', this.handleScroll);
            if(!getSession("projectId")){
                setSession("projectId", "");
            }  
        },
        methods:{
            init(){
                var params = {
                    url: "api/projectlist?onlyDirect=true&status=UNPAID&offset="+ (this._data.page*10) +"&limit=10",
                    type: "get",
                    success: res => {
                        this._data.notice = res.data.notice;
                        if(res.data.totalCount){
                            let array = res.data.projects;
                            for(let i=0; i<array.length; i++){
                                if(array[i].eventDate){
                                    array[i].weeks = getMonday(array[i].eventDate);
                                    if(this.$i18n.locale=="en"){
                                        array[i].eventDate = dateFormat(array[i].eventDate,"dd/MM/yyyy");
                                    }else{
                                        array[i].eventDate = dateFormat(array[i].eventDate,"yyyy年MM月dd日");
                                    }
                                    array[i].datetime = array[i].eventDate + " " + array[i].weeks +" " + array[i].eventTime;
                                }
                                this.listorder.push(array[i]);     
                            }
                            if(res.data.totalCount > 10 ){
                                this._data.totalPage = Math.floor(res.data.totalCount/10);
                                this._data.loading = true;
                                this._data.height = "";
                                this._data.startData = true;                                                                                    
                            }
                            if(this._data.totalPage == this._data.page){
                                this._data.loading = false;
                                this._data.startData = false;                                                        
                            }
                        }else{
                            this.listorder = [];
                        }
                    }
                }
                if(this._data.page != 0){
                    params.loading = false                
                }
                ajax(params);
            },
            payment(bills){
                if(window.gtag){
                    window.gtag('event', 'payment-trigger', {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                    window.gtag('event', 'payment-complete', {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                }
                for(let i=0; i<bills.length; i++){
                    if(bills[i].status == 'WAIT_FOR_PAY'){
                        payAlipay({
                            alipayBool:this.$alipayBool,
                            billId:bills[i].billId,
                            api:process.env.API_HOST,
                        })
                        // payAlipay(this.$alipayBool,bills[i].billId,process.env.API_HOST)                        
                        // let href = process.env.API_HOST+'api/alipayhk/bill/'+ bills[i].billId +'/pay'
                        // window.location.href =href;
                        return;
                    }
                }
            },
            handleScroll(){
                if(!this._data.height){
                    var dom = this.$refs.allList;
                    this._data.height = dom.clientHeight;
                }                      
                var box = this.$refs.payment;
                var scrollTop = box.pageYOffset || box.scrollTop 

                if( scrollTop+this._data.allHeight >= this._data.height){
                    if(this._data.totalPage != this._data.page){
                         if(this._data.startData){
                            this._data.page++
                            this.init();
                            this._data.startData = false;                            
                        }
                    }
                }
            },
            presDeta(id){
                this.setProjectId(id);
                setSession("projectId", id);
                this.$router.push({
                    name:'presDeta',
                    params: {lang: this.$i18n.locale, projectId: id},
                })
            },
        }
    }
</script>