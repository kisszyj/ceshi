<template>
    <div class="ongoing posit" ref="ongoing">
        <scroll-notice v-if="notice" v-bind:data="{text:notice,}" ></scroll-notice>
        <div class="all-box" >
            <div class="ongoing-list" ref="allList">
                <div class="all-itme" v-for="item in listorder" @click="presDeta(item.id)">
                    <div class="itme-title">{{item.categoryLabel}}<i v-if="item.lastNewEvent" class="lastnew">N</i></div>
                    <div class="itme-text">{{item.address}}</div>
                    <div class="itme-text">{{item.datetime}}</div>
                    <div class="itme-foor">
                        <div class="foot-text" v-if="item.status=='QUOTING' || item.status=='UNPAID'">{{ $t('message.order.has') }}</div>
                        <div class="foot-text" v-if="item.status=='RESCHEDULING' || item.status=='RESCHEDULING'">{{ $t('message.order.wtchan') }}</div>

                        <div class="foot-text" v-if="item.status=='CANCELLING' || item.status=='CANCELLING'">{{ $t('message.order.wtcancel') }}</div>
                        <div class="foor-box" v-if="item.status=='HIRED'"> 
                            <div class="foot-text">
                            <span> {{ $t('message.order.people') }} </span>
                            <i></i> 
                            </div>
                            <div class="foor-btn">
                                <div class="foorBtn" v-on:click.stop="people(item.supplier.supplierId)">{{ $t('message.order.peopleBtn') }}</div>
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
    import { ajax, dateFormat, getMonday ,PackageId, setSession, getSession } from '@/util/util'
    import scrollNotice from "../../components/scrollNotice"
    export default {
        name: 'ongoing',
        data() {
            return {
                listorder: [],
                loading:false,
                page:0,
                totalPage:0,
                height:"",
                allHeight:"",
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
            var box = this.$refs.ongoing;
            this._data.allHeight = box.clientHeight;            
            box.addEventListener('scroll', this.handleScroll)
            if(!getSession("projectId")){
                setSession("projectId", "");
            }
        },
        methods:{
            init(){
                var params = {
                    url: "api/projectlist?onlyDirect=true&status=INPROCESS&offset=" + (this.page*10) + "&limit=10",
                    type: "get",
                    success: res => {
                        this._data.notice = res.data.notice;
                        if(res.data.projects){
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
                var box = this.$refs.ongoing;
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
                    name:"presDeta",
                    params: {lang: this.$i18n.locale, projectId: id},                    
                }) 
            },
            people(id){
                this.setSupplierId(id);
                setSession("supplierId", id);
                this.$router.push({
                    name:"people",
                    params: {lang: this.$i18n.locale, supplierId:id},                    
                })
            },
        }
    }
</script>