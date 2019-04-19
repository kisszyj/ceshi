<template>
    <div class=" posit">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.head.modify'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="modify scoll">
                <div class="why">
                    <div class="why-title ques-icon">
                        <i></i>
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
                <div class="modify-date" @click="times">
                    <div class="date-left ques-icon">
                        <i></i>
                        <span>{{$t('message.modify.timearr')}}</span>
                    </div>
                    <div class="date-right" v-if="date.dates">{{date.dates}} {{date.week}}，{{date.time}}-{{ date.endTime }}</div>
                </div>
                <div class="addprices">
                    <div class="modify-price"  v-for="item in prices">
                        <div class="price-left">{{ item.title }}</div>
                        <div class="price-right">${{ (item.amount/100) }}</div>
                    </div>
                </div>

                <div class="tipbox" v-for="(item, key) in tipList" v-if="item.tipTitle">
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

                <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
                
            </div>
        </div>
        <div class="btn-box" >
            <div class="btn" @click="modalfun">{{$t('message.btn.submit')}}</div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import {ajax,dateFormat,getMonday,PackageId, getSession} from "@/util/util";    

    export default {
        name: 'modify',
        components:{
            headTop:headTop,
        },
        data() {
            return {
                num:8,
                list:[1,2,3,4,5],
                sele: 0,
                whytxt: "",
                whyList:[],
                date:{},
                data:{},
                prices:[],
                className:"zh-hk",
                tipList: [],
                packageNumber: "",
                timeQuestionNumber:"",
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
        },
        methods:{
            obtainTime(datas){
                datas.week = getMonday(datas.date);
                if(this.$i18n.locale=="en"){
                    datas.dates = dateFormat(datas.date,"dd/MM/yyyy");
                }else{
                    datas.dates = dateFormat(datas.date,"yyyy年MM月dd日");
                }
                this._data.date = datas;
                if(this.$whyText){
                    this._data.whytxt = this.$whyText;
                }
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
                this.setWhyQuestionNumber(this._data.data.questionNumber)
                if(this._data.whytxt){
                    this.setWhyText(this._data.whytxt);
                }
                this.$router.push({
                    name:"modifyTime",
                    params: {lang: this.$i18n.locale, pageNumber: this.packageNumber,questionNumber:this._data.timeQuestionNumber},                    
                })
            },
            getData(){
                var datas = {
                    purpose:"RESCHEDULE",
                    projectId:this.projectId,
                    questions:[],
                    pageNum:1,
                }
                if(this.$date.start){                
                    datas.questions.push({
                        questionNumber:this.$date.questionNumber,
                        answers:[{value:this._data.date.date + " " + this._data.date.time}]
                    })
                    datas.pageNum = 2;
                }
                const { whyList , data } = this._data;
                
                if(whyList.length > 0 || this.$why.length > 0){
                    const list = whyList.length!==0?whyList:this.$why;
                    const ques = this.$whyQuestionNumber?this.$whyQuestionNumber:data.questionNumber;
                    let why = {
                        questionNumber:ques,
                        answers:[]
                    };
                    for(var i=0; i<list.length;i++){
                        if(list[i].start){
                            var obj = {
                                value:list[i].value,
                            }
                            if(list[i].canDescribe){
                                if(this._data.whytxt){
                                    obj.other = this._data.whytxt;                                
                                }
                            }
                            why.answers.push(obj);                       
                        }
                    }
                    datas.questions.push(why);
                }
                var params = {
                    url:"api/package/direct/"+ this.packageNumber +"/questions",
                    type:"post",
                    data:datas,
                    success:res=>{
                        var data = res.data.questions[0];                        
                        if(JSON.stringify(this.$why) != "[]"){
                            this._data.whyList = this.$why;
                        }else if(whyList.length === 0){
                            var list = data.possibleValues
                            for(var i=0; i<list.length; i++){
                                data.possibleValues[i].start = false;
                            }
                            this._data.whyList = list;                            
                        }
                        this._data.data = data;

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
                            if(res.data.questions[j].type === "DATETIME"){
                                this._data.timeQuestionNumber = res.data.questions[j].questionNumber;
                            }
                        }
                        this.tipList = res.data.questions;
                    }
                }
                ajax(params);
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

                var datas = {
                    action:"RESCHEDULE",
                    questions:[
                        {
                            questionNumber:this.$date.questionNumber,
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
                
                // if(!list[index].canDescribe){
                //     this._data.whytxt = "";                    
                // }
                if(this._data.data.multiple){
                    list[index].start = !list[index].start;                    
                }else{
                    for(var i=0; i<list.length; i++){
                        list[i].start = false;
                    }
                    list[index].start = true;                                        
                }
                this.getData();
                
            },
            set(index){
                this._data.whyList[index].start = true;
            }
        }
    }
</script>