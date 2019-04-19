<template>
    <div class="posit-box">
        <head-top v-if="!$alipayBool && $isMobile"  @backClick="changeBack" v-bind:data="{title:$t('message.head.modify'),start:true}"></head-top>
        <booking-head-web v-if="!$isMobile" @backClick="changeBack" v-bind:data="{title:$t('message.head.modify'),back:true}" ></booking-head-web>
        <div class="posit" :class="{'addTopHeight': !($alipayBool) && $isMobile}">
            <div class="modifyBox">
                <div class="modify scoll">
                    <div v-if="!$isMobile" class="modify-title">{{$t('message.head.modify')}}</div>
                    <div class="modify-left">
                        <div class="why">
                            <div class="why-title ques-icon">
                                <i v-if="$isMobile"></i>
                                <span v-if="!$isMobile">1.</span>
                                <span>{{ data.label }}</span>
                            </div>
                            <div class="why-list">
                                <div class="why-item" v-for="(item,index) in whyList" @click="whyBtn(index)">
                                    <div class="why-top">
                                        <i class="ation-icon" v-if="data.multiple"  :class="item.start?'start':''"></i>
                                        <i class="why-icon" v-else :class="item.start?'start':''"></i>
                                        <span>{{ item.label }}</span>
                                    </div>
                                    <div class="why-text" v-on:click.stop="set(index)" v-if="item.canDescribe">
                                        <textarea :class="className" :placeholder="item.placeholder?item.placeholder:''" v-model="whytxt"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modify-date" @click="times" v-if="$isMobile">
                            <div class="date-left ques-icon">
                                <i></i>
                                <span>{{$t('message.modify.timearr')}}</span>
                            </div>
                            <div class="date-right"  v-if="date.dates">{{date.dates}} {{date.week}}，{{date.time}}-{{ date.endTime }}</div>
                        </div>
                        <div class="modify-date modifyTime" v-if="!$isMobile">
                            <div class="date-left ques-icon">
                                <span>2.{{dateData.label}}</span>
                            </div>
                            <div class="week-list">
                                <div class="week-item"  v-for="(item,index) in weekList">
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
                            <div class="date-left ques-icon">
                                <span>請選擇服務時段</span>
                            </div>
                            <div class="week-list">
                                <div class="week-item"  v-for="(item,index) in timeList">
                                    <div class="time-send" v-if="item.available" :class="item.start?'start':''" @click="timeBtn(index)">
                                        <div class="time-time">{{ item.startTime }}-{{item.endTime}}</div>
                                        <div class="time-text" v-if="item.tip" >{{ item.tip }}</div>
                                    </div>
                                    <div class="time-send disabled" v-else>
                                        <div class="time-time">{{ item.startTime }} - {{item.endTime}}</div>
                                        <div class="time-text" v-if="item.tip" >{{ item.tip }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="date-left ques-icon">
                                <span>已選時段</span>
                            </div>
                            <div class="date-right"  v-if="date.dates">
                                <span>{{date.week}}  {{date.dates}} ，{{date.time}} <span v-if="date.time && date.endTime"> - </span>{{ date.endTime }}</span>
                                <i class="date-right-icon" @click="deleteDate" :style="{backgroundImage:'url('+require('../../img/icon-cross-gray.png')+')'}"></i>
                            </div>
                        </div>
                        <div v-if="!$isMobile" class="modify-btn">
                            <div class="web-btn">
                                <div class="webBtn" @click="modalfun">{{$t('message.btn.submit')}}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="addprices" v-if="$isMobile">
                        <div class="modify-price"  v-for="item in prices">
                            <div class="price-left">{{ item.title }}</div>
                            <div class="price-right">${{ (item.amount/100) }}</div>
                        </div>
                    </div>

                    <div class="tipbox" v-for="(item, key) in tipList" v-if="item.tipTitle && $isMobile">
                        <div class="tipitem">
                            <div class="tiptop">
                                <div class="tiptel">{{item.tipTitle}}</div>
                                <div class="tipicon" :class="item.start?'reducestart':'addstart'" @click="subtractFun(key)"></div>
                            </div>
                            <div class="tipmes" v-if="item.start">{{item.tip}}</div>
                        </div>
                    </div>

                    <!-- <div class="modify-prompt" v-for="item in tipList" v-if="item.tipTitle">
                        <div class="prompt-title">{{ item.tipTitle }}</div>
                        <div class="prompt-text">{{ item.tip }}</div>
                    </div> -->

                    <div class="app-foor" v-if="$isMobile"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
                    
                </div>
                <div>
                    <div class="modifyWebRight">
                        <div class="tipbox" v-for="(item, key) in tipList" v-if="item.tipTitle && !$isMobile">
                            <div class="tipitem">
                                <div class="tiptop">
                                    <div class="tiptel">{{item.tipTitle}}</div>
                                    <div class="tipicon" :class="item.start?'reducestart':'addstart'" @click="subtractFun(key)"></div>
                                </div>
                                <div class="tipmes" v-if="item.start">{{item.tip}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modifyWebRight">
                        <div class="addprices" v-if="!$isMobile">
                            <div class="modify-price"  v-for="item in prices">
                                <div class="price-left">{{ item.title }}</div>
                                <div class="price-right">${{ (item.amount/100) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-box" v-if="$isMobile">
            <div class="btn" @click="modalfun">{{$t('message.btn.submit')}}</div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import bookingHeadWeb from "../../components/bookingHeadWeb";
    import {ajax,dateFormat,getMonday,PackageId, getSession} from "@/util/util";    

    export default {
        name: 'modify',
        components:{
            headTop:headTop,
            bookingHeadWeb:bookingHeadWeb,
        },
        data() {
            return {
                num:8,
                list:[1,2,3,4,5],
                sele: 0,
                whytxt: "",
                whyList:[],
                dateData:{},
                date:{},
                data:{},
                prices:[],
                className:"zh-hk",
                tipList: [],
                packageNumber: "",
                weekList:[],
                timeList:[],
                defaults:"",
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang, packageId} } = this.$route;
            this.packageNumber = packageId;
            this.$i18n.locale=lang;
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.modify'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            this._data.className = this.$i18n.locale;
            if(JSON.stringify(this.$date) != "{}"){
                // var datas = this.$date
                this.obtainTime(this.$date)
                
            }else{
                var datas = getSession("modifyTimes");
                this.obtainTime(datas)
            }
            if(this.$projectId){
                this.projectId = this.$projectId;
            }else{
                this.projectId = getSession("projectId");
            }
            this.getData();

            if(!this.$isMobile){
                const dates = getSession("modifyDate");
                let data = {
                    pageNum:1,
                    questions:[{
                        answers:dates.answers,
                        questionNumber:dates.questionNumber,
                    }], 
                }
                this.webGetDateList(data)
            }
        },
        methods:{
            obtainTime(datas){
                datas.week = getMonday(datas.date);
                if(this.$i18n.locale=="en"){
                    datas.dates = dateFormat(datas.date,"MM/yyyy");
                }else{
                    datas.dates = dateFormat(datas.date,"MM月dd日");
                }
                this._data.date = datas;
                if(this.$whyText){
                    this._data.whytxt = this.$whyText;
                }
            },
            deleteDate(){
                this._data.date = {}
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
                this._data.date = {
                    week:list[index].tip,
                    dates:list[index].date,
                    date:list[index].day,
                    time:"",
                    endTime:"",
                }
                this._data.defaults = list[index];     
            },
            timeBtn(index){
                var list = this._data.timeList;
                for(var i = 0; i<list.length; i++){
                    list[i].start = false;
                }
                list[index].start = true;
                const defaults = this._data.defaults;
                let dates = {
                    week:defaults.tip,
                    dates:defaults.date,
                    date:defaults.day,
                    time:list[index].startTime,
                    endTime:list[index].endTime,
                    start:true,
                };
                this._data.date = dates;
                this.setDate(dates);
                this.getData(dates);
            },
            subtractFun(index){// Tip 的 message 是否显示
                this.tipList[index].start = !this.tipList[index].start;
                this.$forceUpdate();
            },
            changeBack(){
                this.setWhy([]);
                this.setWhyText("");
                this.setAbout("item",{});
                this.setDate({});  
                this.$router.back(-1);          
            },
            times(){
               this.setWhy(this._data.whyList);
                if(this._data.whytxt){
                    this.setWhyText(this._data.whytxt);
                }
                this.$router.push({
                    name:"modifyTime",
                    params: {lang: this.$i18n.locale, pageNumber: this.packageNumber},                    
                })
            },
            getData(date){
                var datas = {
                    purpose:"RESCHEDULE",
                    projectId:this.projectId,
                    questions:[],
                    pageNum:1,
                }
                if(date && !this.$isMobile){
                    datas.questions.push({
                        questionNumber:this._data.dateData.questionNumber,
                        answers:[{value:date.date + " " + date.time}]
                    })
                    datas.pageNum = 2;
                }else{
                    if(this.$date.start){                
                        datas.questions.push({
                            questionNumber:this.$date.questionNumber,
                            answers:[{value:this._data.date.date + " " + this._data.date.time}]
                        })
                        datas.pageNum = 2;
                    }
                }
                var params = {
                    url:"api/package/direct/"+ this.packageNumber +"/questions",
                    type:"post",
                    data:datas,
                    success:res=>{
                        var data = res.data.questions[0];                        
                        if(JSON.stringify(this.$why) != "[]"){
                            this._data.whyList = this.$why;
                        }else{
                            var list = data.possibleValues
                            for(var i=0; i<list.length; i++){
                                data.possibleValues[i].start = false;
                            }
                            this._data.whyList = list;                            
                        }
                        this._data.data = data;
                        this._data.dateData = res.data.questions[1];

                        if(res.data.prices){
                            this._data.prices = res.data.prices;
                        }
                        let num = 0;
                        for(var j=0; j<res.data.questions.length; j++){
                            if(res.data.questions[j].tipTitle && j===0){
                                res.data.questions[j].start = true;
                                num++;
                            }else{
                                res.data.questions[j].start = false;
                            }
                        }
                        this.tipList = res.data.questions;
                    }
                }
                ajax(params);
            },
            webGetDateList(data){
                var params = {
                    url:"api/package/direct/"+ this.packageNumber +"/schedules",
                    data:data,
                    type:"post",
                    success:res=>{
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
                        // 是否存在历史时间
                        if(JSON.stringify(this.$date) != "{}"){
                            var datas = this.$date
                            for(var i=0; i<weekList.length;i++){
                                if(weekList[i].day === datas.date){
                                    weekList[i].start = true;
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
                        console.log(this.$date)
                        // 设置默认值
                        if(endEatd || JSON.stringify(this.$date) === "{}"){
                            for(var i=0; i<weekList.length;i++){
                                if(weekList[i].available){
                                    weekList[i].start = true;
                                    this._data.defaults = weekList[i];
                                    this._data.timeList = weekList[i].times;
                                    break;
                                }
                            }
                        }   
                        
                    }
                }
                ajax(params)
            },
            ticket(data){
                var params = {
                    url:"api/project/"+ this.projectId +"/ticket",
                    type:"post",
                    data:data,
                    success:res=>{
                        var datas = {
                            titel:res.data.responseTitle,
                            contents:res.data.responseMessage,
                            projectId: this.projectId
                        }
                        this.$root.eventHub.$emit('showmodal', datas);
                    }
                }
                ajax(params);
            },
            modalfun(){

                if(!this._data.date || JSON.stringify(this._data.date) === "{}"){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this._data.dateData.label,
                    });
                    return;
                }

                let datas = {
                    action:"RESCHEDULE",
                    questions:[
                        {
                            questionNumber:this._data.dateData.questionNumber,
                            answers:[{value:this._data.date.date + " " + this._data.date.time}]
                        },
                        {
                            questionNumber:this._data.data.questionNumber,
                            answers:[]
                        }
                    ]
                };
                var whyList = this._data.whyList;
                var start = 0;
                for(var i=0; i<whyList.length;i++){
                    if(whyList[i].start){
                        var obj = {
                            value:whyList[i].value,
                        }
                        if(whyList[i].canDescribe){
                            if(this._data.whytxt){
                                obj.other = this._data.whytxt;                                
                            }else{
                                this.$root.eventHub.$emit("showprompt",{
                                    content:whyList[i].label,
                                });
                                return;
                            }
                        }
                        start++;
                        datas.questions[1].answers.push(obj);                       
                    }
                }
                if(!start){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.data.label,
                    });
                    return;
                }
                this.ticket(datas);
            },
            whyBtn(index){
                var list = this._data.whyList;
                if(this._data.data.multiple){
                    list[index].start = !list[index].start;                    
                }else{
                    for(var i=0; i<list.length; i++){
                        list[i].start = false;
                    }
                    list[index].start = true;                                        
                }
               this.setWhy(list);                
            },
            set(index){
                this._data.whyList[index].start = true;
            }
        }
    }
</script>