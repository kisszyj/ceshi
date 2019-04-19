<template>
    <div class="posit-box">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.head.time'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="modifyTime scoll">
                <div class="modifyTime-prompt" v-if="text">{{text}}</div>
                <div class="modifyTime-date">
                    <div class="date-title">{{ $t('message.about.date') }}</div>
                    <div class="date-list">
                        <div class="swiper-container swiper2">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="(item,index) in weekList" >
                                    <div class="date-item" v-if="item.available" :class="item.start?'start':''" @click="weekBtn(index)">
                                        <div class="week">{{item.tip}}</div>
                                        <div class="date-time">{{item.date}}</div>
                                        <div v-if="item.extraFeeTip" class="date-div">
                                            <div  class="date-text yellow">
                                                <span>{{ item.extraFeeTip }}</span>
                                            </div>
                                        </div>
                                        <div v-if="item.discountFeeTip" class="date-div">
                                            <div  class="date-text">
                                                <span>{{ item.discountFeeTip }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="date-item disabled" v-else>
                                        <div class="week">{{item.tip}}</div>
                                        <div class="date-time">{{item.date}}</div>
                                        <div v-if="item.extraFeeTip" class="date-div">
                                            <div  class="date-text yellow">
                                                <span>{{ item.extraFeeTip }}</span>
                                            </div>
                                        </div>
                                        <div v-if="item.discountFeeTip" class="date-div">
                                            <div  class="date-text">
                                                <span>{{ item.discountFeeTip }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modifyTime-date">
                    <div class="date-title">{{ $t('message.about.time') }}</div>
                    <div class="date-list time-list">
                        <div class="time-item" v-for="(item,index) in timeList" >
                            <div class="time-send" v-if="item.available" :class="item.start?'start':''" @click="timeBtn(index)">
                                <div class="time-time">{{ item.startTime }}-{{item.endTime}}</div>
                                <div class="time-text" v-if="item.tip" >{{ item.tip }}</div>
                            </div>
                            <div class="time-send disabled" v-else>
                                <div class="time-time">{{ item.startTime }}-{{item.endTime}}</div>
                                <div class="time-text" v-if="item.tip" >{{ item.tip }}</div>
                            </div>
                        </div>
                        <div class="time-item" v-for="item in timeArr"></div>
                    </div>
                </div>
                <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
        </div>
        <div class="btn-box">
            <div class="btn " :class="classStart?'':'disabled'" @click="getTime">{{ $t('message.btn.mine2') }}</div>
        </div>       
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import {ajax,getQuestionsItem,dateFormat,getMonday,getEndate,setSession,getQuestions,PackageId,getSession, setQuestions} from "@/util/util";
    
    export default {
        name: 'aboutTime',
        components:{
            headTop:headTop,
        },
        data() {
            return {
                num:8,
                weekList:[],
                timeList:[],
                text:"",
                date:{},
                time:{},
                classStart:false,
                timeArr: [],
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
                    title: this.$t('message.head.time'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            var param = getQuestions();
            var datas = getQuestionsItem(param,2);
            console.log(datas)
            this.getData(datas);
        },
        methods:{
            // 返回
            changeBack(){
                this.$router.back(-1);
            },
            // 选择服务日期
            weekBtn(index){
                var list = this._data.weekList;
                for(var i = 0; i<list.length; i++){
                    list[i].start = false;
                }
                list[index].start = true;
                for(var i = 0; i<list[index].times.length; i++){
                    list[index].times[i].start = false;
                }
                this._data.timeList = list[index].times;
                this._data.date = list[index];
                this._data.time = {};
                this._data.classStart = false;
            },
            // 选择服务时间
            timeBtn(index){
                var list = this._data.timeList;
                for(var i = 0; i<list.length; i++){
                    list[i].start = false;
                }
                list[index].start = true;
                this._data.time = list[index]
                this._data.classStart = true;                
            },
            // 获取时间
            getData(data){
                var params = {
                    url:"api/package/direct/"+ this.$path +"/schedules",
                    data:data,
                    type:"post",
                    success:res=>{
                        this._data.text = res.data.tip;
                        var weekList = res.data.days;
                        for(var i=0; i<weekList.length; i++){
                            weekList[i].start = false;                            
                            if(this.$i18n.locale=="en"){
                                weekList[i].date = getEndate(weekList[i].day);
                            }else{
                                weekList[i].date = dateFormat(weekList[i].day,"MM月dd日");
                            }
                            // weekList[i].monday = getMonday(weekList[i].day,1);
                            for(var j=0; j<weekList[i].times.length;j++){
                                weekList[i].times[j].start = false;
                            }                            
                        }
                        this._data.weekList = weekList;
                        
                        var dates = getSession("dates");
                        let dateSe = dates.dates;
                        if(dateSe){
                            for(var i=0; i<weekList.length;i++){
                                if(weekList[i].day === dateSe.day){
                                    weekList[i].start = true;
                                    this._data.date = weekList[i];
                                    this._data.timeList = weekList[i].times;
                                    for(var j=0; j<weekList[i].times.length; j++){
                                        if(weekList[i].times[j].startTime === dateSe.startTime && weekList[i].times[j].endTime === dateSe.endTime){
                                            weekList[i].times[j].start = true;
                                            this._data.time = weekList[i].times[j];
                                            this._data.classStart = true; 
                                            break;
                                        }               
                                    }
                                    break;
                                }
                            }
                        }else{
                            for(var i=0; i<weekList.length;i++){
                                if(weekList[i].available){
                                    weekList[i].start = true;
                                    this._data.date = weekList[i];
                                    this._data.timeList = weekList[i].times;
                                    break;
                                }
                            }
                        }
                        if(this._data.timeList.length>0 && this._data.timeList.length%4!==0){
                            let count = this._data.timeList.length % 4;
                            for(let i=0; i<4-count; i++){
                                this._data.timeArr.push(i)
                            }
                        }
                        
                        setTimeout(()=>{
                            var swiper = new Swiper('.swiper2', {
                                slidesPerView: 3.8,
                                spaceBetween: 10,
                                freeMode: true
                            });
                        },200)
                        
                    }
                }
                ajax(params)
            },
            // 确认提交
            getTime(){
                var data = this._data;
                if(JSON.stringify(data.date) == "{}"){
                    myApp.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.about.date'),
                    });
                    return;
                }
                if(JSON.stringify(data.time) == "{}"){
                    myApp.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.about.time'),
                    });
                    return;                    
                }
                var datas = {
                    day:data.date.day,
                    monday:data.date.tip,
                    startTime:data.time.startTime,
                    endTime:data.time.endTime,
                    date:data.date.date,
                }

                var one = getSession("dates");
                if(window.gtag){
                    window.gtag('event', `${one.questionNumber.toLowerCase()}-finish`, {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                }
                one.dates = datas;
                setQuestions(one, 2);
                setSession("dates",one);
                this.$router.back(-1);                
            }
        }
    }
</script>