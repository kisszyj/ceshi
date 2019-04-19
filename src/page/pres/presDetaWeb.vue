<template>
    <div class="posit-box">
        <booking-head-web  @backClick="changeBack" v-bind:data="{title:$t('message.head.detail'),back:true}"></booking-head-web>
        <div class="posit" >
          <div class="presDeta scoll" >
              <div class="presDeta-left">
                <div class="content-title">{{onepres.categoryLabel}}</div>
                <div class="presDeta-content">
                    <div class="content-item" v-for="item in onepres.questions" v-if="item.answers.length>0">
                        <div class="item-title" >{{ item.shortLabel }} :</div>
                        <div class="item-text"  v-for="ite in item.answers">
                            <span v-if='ite.valueType === "TEXT" || ite.valueType === "ADDRESS"'>
                                <span v-if="ite.other">{{ite.other}}</span>
                                <span v-else-if="ite.label">{{ite.label}}</span>
                                <span v-else-if="ite.value">{{ite.value}}</span>
                            </span>
                            <span v-if='ite.valueType !== "TEXT" && ite.valueType !== "ADDRESS" && ite.valueType !== "DATETIME" && ite.valueType !== "NUMBER" '>{{ite.value}}</span>
                            <span v-if='ite.valueType !== "TEXT" && ite.valueType !== "ADDRESS" && ite.valueType === "DATETIME"'>{{dateTime(item,ite.value)}}</span>
                            <span v-if='ite.valueType !== "TEXT" && ite.valueType !== "ADDRESS" && ite.valueType === "NUMBER"'>{{setNum(item,ite.value)}}</span>
                        </div>
                    </div>
                    <div class="content-item" v-if="onepres.reschedulingDate">
                        <!-- <div class="item-title">{{ $t('message.about.lasttime') }} :</div> -->
                        <div class="item-title">{{ onepres.reschedulingDateLabel }} :</div>
                        <div class="item-text">{{onepres.reschedulingDate}}</div>
                    </div>
                    <div class="people-record" @click="process" v-if="cmdDate.service_flow_title">{{cmdDate.service_flow_title}}</div>
                </div>
                <div class="review" v-if="setBtnbool==2">
                    <div class="review-text">留下您的寶貴意見，讓我們可以做得更好！</div>
                    <div class="webBtn review-btn" @click="ment">{{ $t("message.order.imme") }}</div>
                </div>
              </div>
              <div class="presDeta-right">
                  <div class="presDeta-right-top">
                    <div class="presDeta-img"  @click="record" :style="{backgroundImage:img}">
                      <div class="presDeta-imgbox">
                          <div class="pres-status">{{setStatus}}</div>
                          <div class="pres-times" v-if="onepres.status=='RESCHEDULING'||onepres.status=='CANCELLED'">{{onepres.lastEventMessage}}</div>
                          <div class="pres-record" @click.stop="record"><i></i>{{ $t('message.order.record') }}</div>
                      </div>
                    </div>
                    <div class="presDeta-people" v-if="supplier">
                      <div class="peoplecont" @click="people(supplier.supplierId)">
                          <i class="people-logo" :style="supplier.logoUrl?{backgroundImage:'url('+supplier.logoUrl+')'}:{backgroundImage:'url('+require('../../img/icon-indiviual@3x.png')+')'}"></i>
                          <div class="people-left">
                            <div class="people-text">
                                <div class="people-name">
                                  <span>{{supplier.name}}</span>
                                  <i class="people-icon people-icon-right" :style="{backgroundImage:'url('+require('../../img/icon-arrow-right.png')+')'}"></i>
                                </div>

                                <div class="people-star">
                                    <i class="icon-star" :class="num >= 1?'start':''"></i>
                                    <i class="icon-star" :class="num >= 2?'start':''"></i>
                                    <i class="icon-star" :class="num >= 3?'start':''"></i>
                                    <i class="icon-star" :class="num >= 4?'start':''"></i>
                                    <i class="icon-star" :class="num >= 5?'start':''"></i>                                
                                </div>
                                <a class="people-phone" :href='`tel:${supplier.countryCode+supplier.phone}`' @click.stop>
                                    <span class="people-phone-title">電話號碼：</span>
                                    <span>{{supplier.phone}}</span>
                                </a>
                            </div>
                          </div>
                      </div>
                      <div class="people-record people-process" @click="clickReacord">{{$t('message.personnel.callser')}}</div>
                    </div>
                  </div>
                  <div class="presDeta-right-top presDeta-right-margin">
                    <div class="billsBox">
                      <div v-for="(item, key) in bills" v-if="bills" class="presDeta-box">
                          <div class="presDeta-price">
                              <div class="price-title">{{item.title}}</div>
                              <div class="price-list">
                                  <div class="price-itme" v-if="item.details" v-for="(ite, index) in item.details">
                                      <div class="price-text" v-if="(index+1)===1">{{ite.itemName}}</div>
                                      <div class="price-text" v-else >{{ite.itemName}}</div>
                                      <div class="price-num">{{(ite.amount/100)>0?'$'+ite.amount/100:'-$'+Math.abs(ite.amount/100)}}</div>
                                  </div>
                              </div>
                              <div class="price-total" v-if="item.status=='PAID'">{{$t('message.presdeta.has')}}: <span>${{(item.price/100)}}</span></div>
                              <div class="price-total red" v-if="item.status=='WAIT_FOR_PAY'">{{$t('message.presdeta.needpay')}} : <span>${{(item.price/100)}}</span></div>
                              <div class="price-total" v-if="item.status=='REFUND'">{{$t('message.presdeta.hasreful')}}: <span>${{(item.price/100)}}</span></div>
                          </div>
                          <div class="presDeta-order" v-if="item.status=='PAID'">
                              <div class="order-item">
                                  <div class="order-title">{{$t('message.presdeta.termspay')}}</div>
                                  <div class="order-text" >{{paymentMethod(key)}}</div>
                              </div>
                              <div class="order-item">
                                  <div class="order-title">{{$t('message.presdeta.timepay')}}</div>
                                  <div class="order-text">{{ item.payment.paymentDate }}</div>
                              </div>
                              <div class="order-item">
                                  <div class="order-title">{{$t('message.presdeta.orderpay')}}</div>
                                  <div class="order-text">{{ item.payment.outBizNo }}</div>
                              </div>
                          </div>
                          <div class="presDeta-order" v-else-if="item.status=='REFUND'">
                              <div class="order-item">
                                  <div class="order-title">{{$t('message.presdeta.refundtime')}}</div>
                                  <div class="order-text">{{item.payment.refundDate}}</div>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="presDeta-btn" >
                        <div class="webBtnGray presDeta-web" v-if="setBtnbool==1" @click="modify">{{ $t('message.order.modify') }}</div>
                        <div class="webBtnGray presDeta-web" v-if="setBtnbool==1" @click="cancel">{{ $t('message.order.cancel') }}</div>
                        <div class="webBtnGray presDeta-web" v-if="setBtnbool==2||setBtnbool==3" @click="report">{{ $t('message.order.complaints') }}</div>
                        <div class="webBtnGray presDeta-web" v-if="setBtnbool==4" @click="contact(0)">{{ $t('message.order.customer') }} </div>                
                        <div class="webBtnGray presDeta-web" v-if="setBtnbool==5" @click="contact(1)">{{ $t('message.order.customer') }} </div>
                        <div class="webBtnGray presDeta-web" v-if="setBtnbool==7" @click="contact(2)">{{ $t('message.order.customer') }} </div>
                        <div class="webBtn presDeta-web" v-if="onepres.status=='UNPAID'||needpay" @click="payment">{{ $t("message.order.payment") }}</div>  
                    </div>
                  </div>
                  <div class="presDeta-right-top presDeta-right-margin"  v-if="setBtnbool==2 || setBtnbool==3" >
                    <div class="again-text">想再一次預約同樣的服務？</div>
                    <div class="webBtn again" @click="again">{{ $t("message.order.again") }}</div>
                  </div>
              </div>
          </div>
          
        </div>
    </div>
</template>
<script>
    import bookingHeadWeb from "../../components/bookingHeadWeb";
    import { ajax, dateFormat, getMonday , PackageId, setSession,setCookie,getUrlVars,payAlipay} from '@/util/util'

    export default {
        name: 'presDetaWeb',
        data() {
            return {
                num:0,
                projectId: "",
                onepres: {},
                supplier: null,
                additional: {},
                notecontent: "",
                bills: [],
                duration:{},
                dates:{},
                needpay: false,
                packageNumber: "",
                cmdDate: {},
                img: "",
            };
        },
        components:{
            bookingHeadWeb:bookingHeadWeb,
        },
        computed: {
            //根据状态设置当前订单状态的进程
            setStatus(){
                let val = this.onepres.status;
                let status = "";
                switch(val){
                    case 'QUOTING':
                        status = this.$t('message.presdeta.status.quoting');
                        break;
                    case 'HIRED':
                        status =  this.$t('message.presdeta.status.hired');
                        break;
                    case 'DONE':
                        status =  this.$t('message.presdeta.status.done');
                        break;
                    case 'RATED':
                        status =  this.$t('message.presdeta.status.rated');
                        break;
                    case 'CANCELLED':
                        status =  this.$t('message.presdeta.status.cancelled');
                        break;
                    case 'UNPAID':
                        status =  this.$t('message.pre.payment');
                        break;
                    case 'RESCHEDULING':
                        status =this.$t('message.presdeta.status.wtchange') ;
                        break;
                    case 'CANCELLING':
                        status =this.$t('message.presdeta.status.wtcancel') ;
                        break;
                }
                return status;
            },
            
            //设置支付方式
            paymentMethod(){
                return function(index){
                    if(this.bills[index].payment){
                        let val = this.bills[index].payment.paymentMethod;
                        let status = "";
                        switch(val){
                            case 'ALIPAY':
                                status = this.$t('message.presdeta.payment.alipay');
                                break;
                            case 'STRIPE':
                                status = this.$t('message.presdeta.payment.stripe');
                                break;
                            case 'CASH':
                                status = this.$t('message.presdeta.payment.cash');
                                break;
                            case 'BANK_TRANSFER':
                                status = this.$t('message.presdeta.payment.bank');
                                break;
                            case 'OTHER':
                                status = this.$t('message.presdeta.payment.other');
                                break;
                        }
                        return status;
                    }else{
                        return null;
                    }
                }
            },
            //根据订单状态动态决定其是否显示
            setBtnbool(){
                if(this.onepres.status=="QUOTING"||this.onepres.status=="HIRED"){//配对中，已匹配，狀態一
                    return 1;
                }else if(this.onepres.status=="UNPAID"){//待付款
                    return 6;
                }else if(this.onepres.status=="DONE"){//服務完成,狀態二
                    return 2;
                }else if(this.onepres.status=="RATED"){//已評價,狀態三
                    return 3;
                }else if(this.onepres.status=="RESCHEDULING"){//等候更改预约，狀態四
                    return 4;
                }else if(this.onepres.status=="CANCELLED"){//已取消
                    return 5;
                }else if(this.onepres.status=="CANCELLING"){//等待取消
                    return 7;
                }
            },
            isPeoplePhone() {
              let temp = ["DONE","RATED"];
              if(this.onepres.status=="DONE"||this.onepres.status=="RATED") {
                return false;
              }else{
                return true;
              }
            }
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            setSession("modifyTimes", "");
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
            
            this.changeLanguage(lang?lang:this.$i18n.locale);
            if(!lang){
                this.$router.push({name: 'index', params: {lang:lang?lang:this.$i18n.locale}});             
            }
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.detail'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            var { params:{projectId} } = this.$route;
            this.projectId = projectId;
            this.setProjectId(projectId);
            setSession("projectId", projectId);
            this.paths = this.$path;
            this.init();
        },
        methods:{
            changeLanguage(lang){
                this.$i18n.locale=lang;
            },
            //根据状态设置当前订单头部背景样式图
            setBgimg(){
                let val = this.onepres.status;
                let status = "";
                switch(val){
                    case 'QUOTING':
                        status = 'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'HIRED':
                        status =  'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'DONE':
                        status =  'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'RATED':
                        status =  'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'CANCELLED':
                        status =  'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'UNPAID':
                        status =  'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'RESCHEDULING':
                        status = 'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                    case 'CANCELLING':
                        status = 'url('+require('../../img/MaskGroup@3x.png')+')';
                        break;
                }
                // return status;
                this.img = status;
            },
            init(){
                var params = {
                    url: "api/project/"+this.projectId,
                    type: "get",
                    success: res => {
                        let ones = res.data;
                        ones.duration = parseInt(ones.duration);
                        if(ones.reschedulingDate){
                            let str = ones.reschedulingDate.split(" ");
                            let da1;
                            if(this.$i18n.locale=="en"){
                                da1 = dateFormat(str[0], "dd/MM/yyyy");//日期
                            }else{
                                da1 = dateFormat(str[0], "yyyy年MM月dd日");//日期
                            }
                            let da2 = getMonday(str[0]);//星期
                            let da3 = str[str.length-1];
                            ones.reschedulingDate = da1 + " " + da2 + " " + da3;
                        }
                        this.onepres = ones;
                        if(res.data.supplier){
                            this.supplier = res.data.supplier;
                            this.num = res.data.supplier.rate;
                        }
                        if(res.data.bills){
                            for(let i=0; i<res.data.bills.length; i++){
                                if(res.data.bills[i].payment){
                                    if(res.data.bills[i].payment.paymentDate && this.$i18n.locale=="en"){
                                        let arr = res.data.bills[i].payment.paymentDate.split(" ");
                                        arr[0] = dateFormat(arr[0], "dd/MM/yyyy");
                                        res.data.bills[i].payment.paymentDate = arr[0] + " " + arr[1];
                                    }
                                }
                                if(res.data.bills[i].status=='WAIT_FOR_PAY'){
                                    this.needpay = true;
                                }
                            }
                            this.bills = res.data.bills;
                        }
                        if(res.data.packageInfo){
                            this.packageNumber = res.data.packageInfo.packageNumber;
                            this.getCms(res.data.packageInfo.packageNumber);
                        }
                        this.setBgimg();
                    }
                }
                ajax(params);
            },
            dateTime(obj,date){
                let str = date.split(" ");
                let da1;
                if(this.$i18n.locale=="en"){
                    da1 = dateFormat(str[0], "dd/MM/yyyy");//日期
                }else{
                    da1 = dateFormat(str[0], "yyyy年MM月dd日");//日期
                }
                let da2 = getMonday(str[0]);//星期
                let da3 = str[str.length-1];
                this.dates = obj;
                return da1 + " " + da2 + " " + da3 +"-"+ (parseInt(this.onepres.eventTime) + this.onepres.duration+":00");
            },
            setNum(obj,num){
                this.duration = obj;
                return num;
            },
            payment(){
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
                let billArr = this.onepres.bills || [];
                console.log(this.onepres)
                console.log(billArr)
                let id = "";
                for(let i=0; i<billArr.length; i++){
                    if(this.onepres.bills[i].status === "WAIT_FOR_PAY"){
                        id = this.onepres.bills[i].billId
                    }
                }
                payAlipay({
                    alipayBool:this.$alipayBool,
                    billId:id,
                    api:process.env.API_HOST,
                    locale:this.$i18n.locale,
                    projectId:this.onepres.id,
                    errorMessage:this.$t('message.errorMessage'),
                })
                // payAlipay(this.$alipayBool,id,process.env.API_HOST)
                // let href = process.env.API_HOST+'api/alipayhk/bill/'+ id +'/pay'
                // window.location.href =href;
            },
            getCms(packageNumber){
                var params = {
                    url:"cms/prismic/alipay/direct-service?packageId="+ packageNumber +"&locale="+ this.$i18n.locale,
                    type:"get",
                    success:res=>{
                        this.cmdDate = res.result;
                    }
                }
                ajax(params, true);
            },
            changeBack(){
                this.setProjectId("");
                this.$router.push({
                    name:"pres",
                    params:{lang:this.$i18n.locale}                    
                })
            },
            //查看服务人员
            people(id){
                this.setSupplierId(id);
                setSession("supplierId", id);
                this.$root.eventHub.$emit("showModalPeople",id);
            },
            //一般清洗流程
            process(){
                let caId = this.packageNumber;
                this.$root.eventHub.$emit("showModalProcess",caId);                
            },
            //取消预约
            cancel(){
                let packId = this.onepres.packageInfo.packageNumber;
                let bool = 0;
                if(this.onepres.status==="UNPAID"){
                    bool = 1;
                }
                this.onepres.status
                this.$router.push({
                    name:"cancel",
                    params: {lang: this.$i18n.locale, bool: bool, packageId: packId},                    
                })
            },
            //更改预约
            modify(){
                // this.setAbout("time",this.duration);
                let packId = this.onepres.packageInfo.packageNumber;
                var obj = {
                    questionNumber:this.dates.questionNumber,
                    date:this.onepres.eventDate,
                    time:this.onepres.eventTime,
                    start:false,
                    endTime:(parseInt(this.onepres.eventTime) + this.onepres.duration) + ":00",
                }
                setSession("modifyDate",this.duration)
                this.setDate(obj);
                setSession("modifyTimes", obj);
                this.setWhy([]);
                this.setWhyText("");
                // this.setDate({
                //     questionNumber:this.dates.questionNumber,
                //     date:this.onepres.eventDate,
                //     time:this.onepres.eventTime,
                //     start:false,
                //     endTime:(parseInt(this.onepres.eventTime) + this.onepres.duration) + ":00",
                // })
                this.$router.push({
                    name:"modify",
                    params: {lang: this.$i18n.locale, packageId: packId},                    
                })
            },
            //评价页
            ment(){
                this.$router.push({
                    name:"ment",
                    params:{lang:this.$i18n.locale},
                })
            },
            //预约记录
            record(){
                this.$router.push({
                    name:"record",
                    params:{lang:this.$i18n.locale},
                })
            },
            //再次预约
            again(){
                let packageId = this.onepres.packageInfo.packageNumber;
                if(this.$alipayBool){
                    AlipayJSBridge.call("popTo", {
                        index: 0,
                        data:{ product_id: "com.hellotoby.service.00001" }
                    });
                }else{
                    this.setPath(packageId);
                    setSession("packageId",packageId);
                    this.$router.push({
                        name:"about",
                        params: {lang: this.$i18n.locale},                    
                    })
                }
            },
            //投訴客服
            report(){
                this.$router.push({
                    name: "report",
                    params: {lang: this.$i18n.locale},
                })
            },
            // 联系客服
            contact(i){
               this.$router.push({
                    name: "contact",
                    params: {lang: this.$i18n.locale, projectId: this.projectId, id:i},
                }) 
            },
            clickReacord(){
                this.$root.eventHub.$emit("showModalRecord");
                // this.$router.push({
                //     name: "serviceRecord",
                //     params: {lang: this.$i18n.locale, projectId: this.projectId},
                // })    
            },
        }
    }
</script>
