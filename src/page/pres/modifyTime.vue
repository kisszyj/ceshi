<template>
    <div class="posit-box">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:$t('message.head.time'),start:true}"></head-top>

        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
        <div class="modifyTime">
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
                <div class="date-title"> {{ $t('message.about.time') }} </div>
                <div class="date-list time-list">
                    <div class="time-item" v-for="(item,index) in timeList" >
                        <div class="time-send" v-if="item.available" :class="item.start?'start':''" @click="timeBtn(index)">
                            <div class="time-time">{{ item.startTime }}-{{item.endTime}}</div>
                            <div class="time-text" v-if="item.tip" >{{ item.tip }}</div>
                        </div>
                        <div class="time-send disabled" v-else>
                            <div class="time-time">{{ item.startTime }} - {{item.endTime}}</div>
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
            <div class="btn" @click="getTime">{{ $t('message.btn.submit') }}</div>
        </div>       
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import {ajax,getQuestionsItem,dateFormat,getMonday,PackageId,getSession} from "@/util/util";
    
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
                timeArr: [],
                pageNumber: "",
                questionNumber:"",
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang, pageNumber} } = this.$route;
            this.$i18n.locale=lang;
            this.pageNumber = pageNumber;
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.time'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path , params:{ questionNumber } } = this.$route;
            this.gaGoogle(path);
            let dates = getSession("modifyDate");
            let data = {
                pageNum:1,
        		questions:[{
                    answers:dates.answers,
                    questionNumber:dates.questionNumber,
                }], 
            }
            this._data.questionNumber = questionNumber;
            this.getData(data);
        },
        methods:{
            changeBack(){
                this.$router.back(-1);
            },
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
                this._data.time = {}                
            },
            timeBtn(index){
                var list = this._data.timeList;
                for(var i = 0; i<list.length; i++){
                    list[i].start = false;
                }
                list[index].start = true;
                this._data.time = list[index]
            },
            getData(data){
                var params = {
                    url:"api/package/direct/"+ this.pageNumber +"/schedules",
                    data:data,
                    type:"post",
                    success:res=>{
                        this._data.text = res.data.tip;
                        var weekList = res.data.days;
                        for(var i=0; i<weekList.length; i++){
                            weekList[i].start = false;                            
                            weekList[i].date = dateFormat(weekList[i].day,"MM月dd日");
                            // weekList[i].monday = getMonday(weekList[i].day,1);
                            for(var j=0; j<weekList[i].times.length;j++){
                                weekList[i].times[j].start = false;
                            }                            
                        }
                        this._data.weekList = weekList;

                        let endEatd = true;
                        if(JSON.stringify(this.$date) != "{}"){
                            var datas = this.$date
                            for(var i=0; i<weekList.length;i++){
                                if(weekList[i].day === datas.date){
                                    weekList[i].start = true;
                                    this._data.date = weekList[i];
                                    this._data.timeList = weekList[i].times;
                                    for(var j=0; j<weekList[i].times.length; j++){
                                        if(weekList[i].times[j].startTime === datas.time && weekList[i].times[j].endTime === datas.endTime){
                                            weekList[i].times[j].start = true;
                                            this._data.time = weekList[i].times[j];
                                            break;
                                        }               
                                    }
                                    endEatd = false;
                                    break;
                                }
                            }
                        }
                        if(endEatd || JSON.stringify(this.$date) === "{}"){
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
            getTime(){
                var data = this._data;
                if(JSON.stringify(data.date) == "{}"){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.about.date'),
                    });
                    return;
                }
                if(JSON.stringify(data.time) == "{}"){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.about.time'),
                    });
                    return;                    
                }
                var datas = {
                    date:data.date.day,
                    week:data.date.tip,
                    time:data.time.startTime,
                    endTime:data.time.endTime,
                    start:true,
                    questionNumber:data.questionNumber,
                }
                this.setDate(datas);
                this.$router.back(-1);                
            }
        }
    }
</script>