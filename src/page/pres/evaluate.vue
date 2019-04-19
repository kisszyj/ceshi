<template>
    <div class="evaluate posit" ref="evaluate">
        <scroll-notice v-if="notice" v-bind:data="{text:notice,}" ></scroll-notice>
        <div class="all-box" >
            <div class="evaluate-list" ref="allList">
                <div class="all-itme" v-for="item in listorder" @click="presDeta(item.id)">
                    <div class="itme-title">{{item.categoryLabel}}<i v-if="item.lastNewEvent" class="lastnew">N</i></div>
                    <div class="itme-text">{{item.address}}</div>
                    <div class="itme-text">{{item.datetime}}</div>
                    <div class="itme-foor">
                        <div class="foor-box"> 
                            <div class="foot-text">
                            <span> {{ $t('message.order.complete') }} </span>
                            <i></i> 
                            </div>
                            <div class="foor-btn">
                                <div class="foorBtn" v-on:click.stop="again(item.packageInfo.packageNumber)">{{ $t('message.order.again') }}</div>
                                <div class="foorBtn" @click.stop.prevent="ment(item.id)">{{ $t('message.order.imme') }}</div>                            
                            </div>
                        </div>
                        <div class="prefer">
                            <div class="prefer-icon"></div>
                            <div class="prefer-text">{{ $t('message.order.text') }}</div>
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
    import { ajax, dateFormat, getMonday , PackageId, setSession, getSession, clearQuestions } from '@/util/util'
    import scrollNotice from "../../components/scrollNotice"
    export default {
        name: 'evaluate',
        data() {
            return {
                list:[1,2,3,4,5,6],
                loading:false,
                listorder: [],
                page:0,
                totalPage:0,
                height:"",
                allHeight:"",
                startData :true, 
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
            var box = this.$refs.evaluate;
            this._data.allHeight = box.clientHeight;            
            box.addEventListener('scroll', this.handleScroll)
            if(!getSession("projectId")){
                setSession("projectId", "");
            }   
        },
        methods:{
            init(){
                var params = {
                    url: "api/projectlist?onlyDirect=true&status=NEEDREVIEW&offset="+ (this._data.page*10) +"&limit=10",
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
            // 监听scorll,实现上拉加载
            handleScroll(){
                if(!this._data.height){
                    var dom = this.$refs.allList;
                    this._data.height = dom.clientHeight;
                }                      
                var box = this.$refs.evaluate;
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
            ment(id){
                this.setProjectId(id);
                setSession("projectId", id);
                this.$router.push({
                    name:"ment",
                    params: {lang: this.$i18n.locale,projectId:id},                    
                })
            },
            again(packageId){
                clearQuestions();
                setSession("address", "");
                setSession("dates", "");
                if(packageId){
                    this.setPath(packageId);
                    setSession("packageId",packageId);
                    this.$router.push({
                        name:"about",
                        params: {lang: this.$i18n.locale},                    
                    });
                }
                return;
            }
        }
    }
</script>