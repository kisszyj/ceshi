<template>
    <div class="all posit" ref="all">
        <scroll-notice v-if="notice" v-bind:data="{text:notice,}" ></scroll-notice>
        <div class="all-box">
            <div class="all-list" ref="allList">
                <div class="all-itme" v-for="item in listorder" @click="allBtn(item.id)">
                    <div class="itme-title">
                        <span class="itme-title-text">{{item.categoryLabel}}<i v-if="item.lastNewEvent" class="lastnew">N</i></span>
                        <div class="status-text" v-if="!$isMobile">
                            <span v-if="item.status === 'QUOTING'">{{ $t('message.order.has') }}</span>
                            <span v-if="item.status === 'HIRED'">{{ $t('message.order.people') }}</span>
                            <span v-if="item.status === 'DONE'">{{ $t('message.order.complete') }}</span>
                            <span v-if="item.status === 'UNPAID'">{{ $t('message.order.increase') }}</span>
                            <span v-if="item.status === 'RATED'">{{ $t('message.order.have') }}</span>
                            <span v-if="item.status === 'CANCELLED'">{{ $t('message.order.cancelled') }}</span>
                            <span v-if="item.status === 'RESCHEDULING'">{{ $t('message.order.wtchan') }}</span>
                            <span v-if="item.status === 'CANCELLING'">{{ $t('message.order.wtcancel') }}</span>
                        </div>
                    </div>
                    <div class="itme-content">
                        <div class="itme-text" v-if="!$isMobile">
                            <div class="itme-itmes-title">訂單號碼：</div>
                            <div class="item-itmes-text">121231231241241241</div>
                        </div>
                        <div class="itme-text" v-if="!$isMobile">
                            <div class="itme-itmes-title">已使用次數：</div>
                            <div class="item-itmes-text">0/1</div>
                        </div>
                        <div class="itme-text">{{item.address}}</div>
                        <div class="itme-text"  >{{item.datetime}}</div>
                        <div class="prefer" v-if="item.status === 'DONE' && !$isMobile">
                            <div class="prefer-icon"></div>
                            <div class="prefer-text">{{ $t('message.order.text') }}</div>
                        </div>
                    </div>
                    <div class="itme-foor">
                        <div class="foot-text" v-if="item.status === 'QUOTING' && $isMobile">{{ $t('message.order.has') }}</div>

                        <div class="foor-box" v-if="item.status === 'HIRED' && $isMobile "> 
                            <div class="foot-text">
                                <span>{{ $t('message.order.people') }}</span>
                                <i></i> 
                            </div>
                            <div class="foor-btn">
                                <div class="foorBtn" v-on:click.stop="people(item.supplier.supplierId)">{{ $t('message.order.peopleBtn') }}</div>
                            </div>
                        </div>

                        <div class="foor-box" v-if="item.status === 'DONE'"> 
                            <div class="foot-text" v-if="$isMobile">
                                <span>  {{ $t('message.order.complete') }}</span>
                                <i></i> 
                            </div>
                            <div v-else />
                            <div class="foor-btn" >
                                <div class="foorBtn" v-on:click.stop="again(item.packageInfo.packageNumber)">{{ $t('message.order.again') }}</div>
                                <div class="foorBtn" v-on:click.stop="ment(item.id)"> {{ $t('message.order.imme') }}</div>                            
                            </div>
                        </div>
                        <div class="foor-box" v-if="item.status === 'UNPAID'"> 
                            <div class="foot-text" v-if="$isMobile">
                                <span>  {{ $t('message.order.increase') }}</span>
                                <i></i> 
                            </div>
                            <div v-else />
                            <div class="foor-btn">
                                <div class="foorBtn" v-on:click.stop="payment(item.bills)">{{ $t('message.order.payment') }}</div>                          
                            </div>
                        </div>

                        <div class="foor-box" v-if="item.status === 'RATED'"> 
                            <div class="foot-text" v-if="$isMobile">
                                <span>{{ $t('message.order.have') }}</span>
                                <i></i> 
                            </div>
                            <div v-else />
                            <div class="foor-btn">
                                <div class="foorBtn" v-on:click.stop="again(item.packageInfo.packageNumber)">{{ $t('message.order.again') }}</div>                          
                            </div>
                        </div>

                        <div class="foot-text" v-if="item.status === 'CANCELLED' && $isMobile">{{ $t('message.order.cancelled') }}</div>

                        <div class="foot-text" v-if="item.status === 'RESCHEDULING' && $isMobile">{{ $t('message.order.wtchan') }}</div>

                        <div class="foot-text" v-if="item.status === 'CANCELLING' && $isMobile">{{ $t('message.order.wtcancel') }}</div>
                            
                    </div>
                    <div class="prefer" v-if="item.status === 'DONE' && $isMobile">
                        <div class="prefer-icon"></div>
                        <div class="prefer-text">{{ $t('message.order.text') }}</div>
                    </div>
                </div>
            </div>
            <div v-if="$isMobile">
                <div class="loading-pres" v-if="loading">
                    <div class="loading-img"></div>
                    <div class="loading-text">{{ $t("message.loading") }}...</div>
                </div>
                <div class="app-foor foor" v-else><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
            <div v-if="!$isMobile">
                <Pagination :pageSize="totalPage" v-model="page" @on-jump="handlePageChange" />
            </div>
        </div>
    </div>
</template>
<script>
    import { ajax, dateFormat, getMonday, getEndate, setSession, getSession,clearQuestions , payAlipay } from '@/util/util'
    import Pagination from '../../components/pagination'
    import scrollNotice from "../../components/scrollNotice"

    export default {
        name: 'all',
        data() {
            return {
                listorder: [],
                page:1,
                height:"",
                allHeight:"",
                loading:false,
                totalPage:1,
                startData:true,
                notice:"",
            };
        },
        components:{
            scrollNotice: scrollNotice,
            Pagination:Pagination
        },
        created(){
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
        },
        mounted(){         
            const { path } = this.$route;
            this.gaGoogle(path);
            this.init();
            if(this.$isMobile){
                var box = this.$refs.all; 
                this._data.allHeight = box.clientHeight;
                box.addEventListener('scroll', this.handleScroll);
                if(!getSession("projectId")){
                    setSession("projectId", "");
                }
            }
            
        },
        methods:{
            // 分页
            handlePageChange(page){
                this._data.page = page;
                this.init();
            },
            // 获取数据
            init(){
                var params = {
                    url: "api/projectlist?onlyDirect=true&offset="+ ((this._data.page-1)*10) +"&limit=10",
                    type: "get",
                    success: res => {
                        this._data.notice = res.data.notice;
                        if(res.data.projects){
                            let array = res.data.projects;
                            for(let i=0; i<array.length; i++){
                                if(array[i].eventDate){
                                    array[i].weeks = getMonday(array[i].eventDate);
                                    if(myApp.$i18n.locale=="en"){
                                        array[i].eventDate = dateFormat(array[i].eventDate,"dd/MM/yyyy");
                                    }else{
                                        array[i].eventDate = dateFormat(array[i].eventDate,"yyyy年MM月dd日");
                                    }
                                    array[i].datetime = array[i].eventDate + " " + array[i].weeks +" " + array[i].eventTime;
                                }
                                if(this.$isMobile){
                                    this.listorder.push(array[i])
                                }
                            }
                            if(!this.$isMobile){
                                this.listorder = array;
                            }
                        }
                        // 判断总条数是否大于10 ，是出现上拉加载loading
                        if(res.data.totalCount > 10 ){
                            // 获取总页码
                           this._data.totalPage = Math.floor(res.data.totalCount/10);
                           this._data.loading = true;
                           this._data.height = "";
                           this._data.startData = true;
                        }
                        //判断当前页码是否等于总页码，是关闭上拉加载loading
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
            // 详情页
            allBtn(id){
                this.setProjectId(id);
                //存訂單ID到session中
                setSession("projectId", id);
                if(this.$isMobile){
                    this.$router.push({
                        name:"presDeta",
                        params: {lang: this.$i18n.locale, projectId: id},                    
                    }) 
                }else{
                    this.$router.push({
                        name:"presDetaWeb",
                        params: {lang: this.$i18n.locale, projectId: id},                    
                    })
                }
                
            },
            // 支付
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
                        // let href = process.env.API_HOST+'api/alipayhk/bill/'+ bills[i].billId +'/pay';
                        // window.location.href =href;
                        return;
                    }
                }
            },
            // 监听scroll 实现上拉加载
            handleScroll(){
                
                if(!this._data.height){
                    var dom = this.$refs.allList;
                    this._data.height = dom.clientHeight;
                }                      
                var box = this.$refs.all;
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
            // 查看服务人员
            people(id){
                this.setSupplierId(id);
                //存服務人員ID
                setSession("supplierId", id);
                this.$router.push({
                    name:"people",
                    params: {lang: this.$i18n.locale},                    
                })
            },
            // 评价
            ment(id){
                this.setProjectId(id);
                //存訂單id到session中
                setSession("projectId", id);
                this.$router.push({
                    name:"ment",
                    params: {lang: this.$i18n.locale,projectId:id},                    
                })
            },
            // 再次预约
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