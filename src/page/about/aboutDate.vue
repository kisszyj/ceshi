<template>
    <div class="aboutDate posit">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.head.about'),start:true}"></head-top>
        <div class="line" :class="{'addLine': !($alipayBool)}">
            <div class="line-start"  :style="'width:'+ level +'%' "></div>
        </div>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="aboutDate-box about scoll" v-bind:style="mask?'overflow: hidden;':''">
                <div v-for="(item,index) in questions">

                    <div class="about-item" v-if="item.type==='ENUMERATION' && !item.multiple">
                        <div>
                            <div class="about-top" :style="item.subLabel?'padding: 16px 8px 0;':''">
                                <div class="top-left ques-icon" style="width: 100%;">
                                    <img src="../../img/ecology-and-environment@3x.png" />
                                    <span>{{item.label}}</span>
                                </div>
                            </div>
                            <div v-if="item.subLabel" class="date-text">{{item.subLabel}}</div>
                        </div>
                        
                        <div class="ation-list">
                            <div v-for="(ite,key) in item.possibleValues" @click="chooseMedicine(index,key,item)" >
                                <div class="ation-item" :class="ite.start?'start':''" >
                                    <i class="ation-round"></i>
                                    <span>{{ ite.label }}</span>
                                </div>
                                <div class="ation-input" v-show="ite.start" v-if="ite.canDescribe">
                                    <input type="text" v-model.trim="ite.other" @change="setOther(index)" v-on:click.stop cursor-spacing="30"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="about-item" v-if="item.type==='ENUMERATION' && item.multiple">
                        <div>
                            <div class="about-top" :style="item.subLabel?'padding: 16px 8px 0;':''">
                                <div class="top-left ques-icon" style="width: 100%;">
                                    <img src="../../img/ecology-and-environment@3x.png" />
                                    <span>{{item.label}}</span>
                                </div>
                                <div class="top-right"></div>
                            </div>
                            <div v-if="item.subLabel" class="date-text">{{item.subLabel}}</div>
                        </div>
                        
                        <div class="ation-list">
                            <div v-for="(ite,key) in item.possibleValues" @click="chooseMore(index,key,item)" >
                                <div class="ation-item" :class="ite.start?'start':''" >
                                    <i class="ation-icon"></i>
                                    <span>{{ ite.label }}</span>
                                </div>
                                <div class="ation-input" v-show="ite.start" v-if="ite.canDescribe">
                                    <input type="text" v-model.trim="ite.other" @change="setOther(index)" v-on:click.stop cursor-spacing="30"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="item.type==='DATETIME'" :class="item.subLabel?'add-label':''">
                        <div class="aboutDate-time" @click="time(item)" :style="item.subLabel?'margin: 0;border: none;padding:15px 8px 0;':''">
                            <div class="time-left ques-icon" :style="item.dates?'':'width: 60%;'">
                                <img src="../../img/ecology-and-environment@3x.png" />
                                <span v-if="item.dates">{{item.shortLabel}}</span>
                                <span v-else>{{item.label}}</span>
                            </div>
                            <!-- <div class="time-left" v-else style="">{{item.label}}</div> -->
                            <div class="time-right" v-if="item.dates">
                                <div class="botm">{{dateTime(item.dates.day)}} {{item.dates.monday}}，{{item.dates.startTime}}-{{item.dates.endTime}}</div>
                            </div>
                            <div class="time-mesg" v-else>{{ $t("message.about.selarea")  }}</div>             
                        </div>
                        <div v-if="item.subLabel" class="date-text">{{item.subLabel}}</div>
                    </div>

                    <div v-if="item.type==='ADDRESS'" :class="item.subLabel?'add-label':''">
                        <div class="about-item" @click="address(item)" :style="item.subLabel?'margin: 0;border: none;':''">
                            <div class="about-top">
                                <div class="top-left ques-icon" :style="item.address?'width: 30%;':'width: 80%;'">
                                    <img src="../../img/ecology-and-environment@3x.png" />
                                    <span v-if="item.address">{{item.shortLabel}}</span>
                                    <span v-else>{{item.label}}</span>
                                </div>
                                <!-- <div class="top-left" v-else style="">{{item.label}}</div> -->
                                <div class="top-right" v-if="item.address" >{{ item.address }}</div>
                                <div class="top-right icon-right" v-else ></div>                    
                            </div>
                        </div>
                        <div v-if="item.subLabel" class="date-text">{{item.subLabel}}</div>
                    </div>

                    <div class="about-item" v-if="item.type==='TEXT'">
                        <div>
                            <div class="about-top" :style="item.subLabel?'padding: 16px 8px 0;':''">
                                <div class="top-left ques-icon" style="width: 100%;">
                                    <img src="../../img/ecology-and-environment@3x.png" />
                                    <span>{{item.label}}</span>
                                </div>
                            </div>
                            <div v-if="item.subLabel" class="date-text" :style="item.subLabel?'padding: 4px 8px 16px;':''">{{item.subLabel}}</div>
                        </div>
                        <div class="textInput">
                            <input type="text" v-model.trim="item.value" @change="setText(index)" :placeholder="item.placeholder" cursor-spacing="30"/>
                        </div>
                    </div>
                </div>
                
                <div class="aboutDate-item" v-if="cmsData.service_flow_title && cmsData.service_flow_description && cmsData.service_flow_action_label">
                    <div class="aboutDate-title">{{ cmsData.service_flow_title }}</div>
                    <div class="aboutDate-text">
                        {{ cmsData.service_flow_description }}
                        <a @click="maskBtn">{{ cmsData.service_flow_action_label }}</a>
                    </div>
                </div>

                <div class="tipbox" style="padding: 24px 8px 0">
                    <div class="tipitem" v-for="(item,index) in questions" v-if="item.tipTitle">
                        <div class="tiptop">
                            <div class="tiptel">{{item.tipTitle}}</div>
                            <div class="tipicon" :class="item.start?'reducestart':'addstart'" @click="subtractFun(index)"></div>
                        </div>
                        <div class="tipmes" v-show="item.start">{{item.tip}}</div>
                    </div>
                </div>

                <div class="aboutDate-item addpadding" v-if="lineList.length>0">
                    <div class="aboutDate-title">{{ $t("message.about.detail") }}</div>
                    <div class="aboutDate-list">
                        <div class="item-line" v-for="item in lineList">
                            <div class="line-title">{{item.itemName}}</div>
                            <div class="line-price">{{ (item.amount/100)>0?"$":"-$" }}{{ Math.abs(item.amount/100) }}</div>
                        </div>
                    </div>
                    <div class="toal-price">{{$t("message.price.subtotal") }}: ${{toalPrice/100}}</div>
                </div>
                <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
        </div>
        <div class="btn-box">
            <div class="btn" v-if="start" @click="next">{{ $t("message.btn.lastnew") }}</div>
            <div class="btn disabled" v-else>{{ $t("message.btn.lastnew") }}</div>
        </div>

        <div class="mask-about" v-if="mask">
            <div class="mask-box">
                <div class="mask-top">
                    <div class="top-title">
                        <i class="mask-top-icon"></i>
                        <span>{{ cmsData.service_flow_title }}</span>
                    </div>
                    <div class="down" @click="down">×</div>
                </div>
                
                <div class="mask-scroll">
                    <div class="mask-list">
                        <div class="mask-item" v-for="(item, index) in cmsData.cleaning_step">
                            <div class="mask-title">
                                <img class="mask-icon" v-lazy="item.image" alt="" v-if="item.image">
                                <span>{{item.title}}</span>
                            </div>
                            <p class="mask-text"><span v-for="(ite,ind) in item.description"><span v-if="item.description.length != (ind+1)">{{" " +ite}},</span><span v-else>{{ite}}.</span> </span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import {ajax,getQuestionsAll,dateFormat,setSession,getSession,getQuestions,PackageId, setQuestions, clearQuestionItem , clearQuestionNumber } from "@/util/util";

    export default {
        name: 'aboutDate',
        components:{
            headTop:headTop,
        },
        data() {
            return {
                level:40,
                start:false,
                mask:false,
                lineList:[],
                toalPrice:0,
                cmsData:"",
                questions: [],
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(getSession("cmsData")){
                this.cmsData = getSession("cmsData");
            }else{
                this.getCms()
            }
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.about'),
                    subtitle: ""
                });
            }
            
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            var param = getQuestions();
            var datas = getQuestionsAll(param,2);
            console.log(datas)
            this.getData(datas);
        },
        methods:{
            subtractFun(index){
                this.questions[index].start = !this.questions[index].start;
            },
            dateTime(date){
                let da1;
                if(this.$i18n.locale=="en"){
                    da1 = dateFormat(date, "dd/MM/yyyy");//日期
                }else{
                    da1 = dateFormat(date, "yyyy年MM月dd日");//日期
                }
                return da1;
            },
            // 返回清除本页中的缓存
            changeBack(){                                    
                this.$router.back(-1)
            },
            isDesable(){
                var ques = this.questions;
                let start = true;
                for(let i=0; i<ques.length; i++){
                    if(ques[i].required){
                        if(ques[i].type === "DATETIME" && !ques[i].dates){
                            start = false;
                        }
                        if(ques[i].type === "ADDRESS" && !ques[i].address){
                            start = false;
                        }
                        if(ques[i].type === "TEXT" && !ques[i].value){
                            start = false;
                        }
                        if(ques[i].type === "ENUMERATION"){//单选，判断是否存在一个为
                            let bool = true;
                            for(let j=0; j<ques[i].possibleValues.length; j++){
                                if(ques[i].possibleValues[j].start){//存在一个为true，则通过
                                    bool = false;
                                    break;
                                }
                            }
                            if(bool){
                                start = false;
                            }
                        }
                    }
                }
                if(start){
                    this.start = true;
                }else{
                    this.start = false;
                }
                return start;
            },
            // 下一步
            next(){
                const isDesable =  this.isDesable()
                if(!isDesable){
                    return;
                }
                var ques = this.questions;
                let start = true;
                for(let i=0; i<ques.length; i++){
                    if(ques[i].type === "ENUMERATION" && !ques[i].multiple){//多选，判断是否存在一个为
                        for(let j=0; j<ques[i].possibleValues.length; j++){
                            if(ques[i].possibleValues[j].start){//存在一个为true，则通过
                                if(ques[i].possibleValues[j].canDescribe && !ques[i].possibleValues[j].other){//如果有附加信息未填写
                                    myApp.$root.eventHub.$emit("showprompt",{
                                        content:ques[i].possibleValues[j].label,
                                    });
                                    start = false;
                                }
                            }
                        }
                    }
                }
                if(start){
                    if(window.gtag){
                        window.gtag('event', 'next-step-2_clicked', {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                    this.$router.push({
                        name:"aboutDetail",
                        params:{lang:this.$i18n.locale}                    
                    })
                }
            },
            // 获取数据
            getData(data){
                var params = {
                    url:"api/package/direct/"+ this.$path +"/questions",
                    data:data,
                    type:"post",
                    success:res=>{
                        var arr = res.data.questions;
                        var questionsSe = getQuestions() || [];
                        //为 Tip 设置状态
                        for(let i=0; i<arr.length; i++){
                            if(i===0){
                                arr[i].start = true;
                            }else{
                                arr[i].start = false;
                            }
                            if(arr[i].type === "DATETIME"){//服务日期
                                if(questionsSe){
                                    for(let j=0; j<questionsSe.length; j++){
                                        if(questionsSe[j].questionNumber === arr[i].questionNumber){
                                            arr[i].dates = questionsSe[j].dates;
                                        }
                                    }
                                }
                            }
                            if(arr[i].type==="ADDRESS"){
                                if(questionsSe){
                                    for(let j=0; j<questionsSe.length; j++){
                                        if(questionsSe[j].questionNumber === arr[i].questionNumber){
                                            arr[i].address = questionsSe[j].address;
                                        }
                                    }
                                }
                            }
                            if(arr[i].type==="TEXT"){
                                if(questionsSe){
                                    for(let j=0; j<questionsSe.length; j++){
                                        if(questionsSe[j].questionNumber === arr[i].questionNumber){
                                            arr[i].value = questionsSe[j].value;
                                        }
                                    }
                                }
                            }
                            if(arr[i].type==="ENUMERATION"){//单选状态，start至多一个为true，单选状态必须存session，多选非必存
                                //判断 session 中是否存已选中状态
                                if(questionsSe){
                                    for(let m=0; m<questionsSe.length; m++){
                                        if(arr[i].type===questionsSe[m].type && arr[i].questionNumber===questionsSe[m].questionNumber){//通过则表示 session 中已存在选中状态
                                            arr[i].possible = questionsSe[m].possible;
                                            if(questionsSe[m].possibleValues){
                                                for(let j=0; j<questionsSe[m].possibleValues.length; j++){
                                                    arr[i].possibleValues[j].start = questionsSe[m].possibleValues[j].start;
                                                    if(questionsSe[m].possibleValues[j].start && questionsSe[m].possibleValues[j].canDescribe){
                                                        arr[i].possibleValues[j].other = questionsSe[m].possibleValues[j].other;
                                                    }
                                                }
                                            }
                                            break;
                                        }else if((m+1) >= questionsSe.length){
                                            arr[i].possible = this.$t('message.about.selarea');
                                            //给每个下拉框的对象添加一个 start 状态
                                            if(arr[i].possibleValues){
                                                for(let j=0; j<arr[i].possibleValues.length; j++){
                                                    arr[i].possibleValues[j].start = false;
                                                }
                                            }
                                        }
                                    }
                                }else{// session 中未存该 question 的值
                                    //给下拉框设置初始值
                                    arr[i].possible = this.$t('message.about.selarea');
                                    //给每个下拉框的对象添加一个 start 状态
                                    if(arr[i].possibleValues){
                                        for(let j=0; j<arr[i].possibleValues.length; j++){
                                            arr[i].possibleValues[j].start = false;
                                        }
                                    }
                                }
                            }
                        }

                        for(let j=0; j<questionsSe.length; j++){
                            if(questionsSe[j].pageNum === 2){
                                let questionEn = true;
                                for(let i=0; i<arr.length; i++){
                                    if(questionsSe[j].questionNumber === arr[i].questionNumber){
                                        questionEn = false;
                                        break;
                                    }
                                }
                                if(questionEn){
                                    clearQuestionNumber(questionsSe[j].questionNumber)
                                }
                            }
                        }

                        this.questions = arr;
                        if(res.data.prices){
                            this._data.lineList = res.data.prices[0].details;
                            this._data.toalPrice = res.data.prices[0].amount;
                        }
                        this.isDesable();
                    },
                    error:res=>{
                        if(res.errorCode == "05002"){
                            myApp.$root.eventHub.$emit("showprompt",{
                                content:res.errorMessage,
                                callback:()=>{                                  
                                    this.$router.back(-1)                                    
                                }
                            });
                        }else if(res.errorCode=="05001"){
                            clearQuestionItem("ADDRESS");
                            myApp.$root.eventHub.$emit("showprompt",{
                                content:res.errorMessage,
                            });
                            var param = getQuestions();
                            var datas = getQuestionsAll(param,2);
                            this.getData(datas);
                        }else{
                            myApp.$root.eventHub.$emit("showprompt",{
                                content:res.errorMessage,
                            });
                        }
                    }
                }
                ajax(params)
            },
            getCms(){
                var params = {
                    url:"cms/prismic/alipay/direct-service?packageId="+ this.$path+"&locale="+ this.$i18n.locale,
                    type:"get",
                    success:res=>{
                        // if(res.result.cleaning_step.length > 0) {
                        //     for(let i=0; i<res.result.cleaning_step.length; i++) {
                        //         if(res.result.cleaning_step[i].image && res.result.cleaning_step[i].image.indexOf('staticfiles3') >= 0){
                        //             res.result.cleaning_step[i].image = res.result.cleaning_step[i].image + '!ali-m';
                        //         }
                        //     }
                        // }
                        this.cmsData = res.result;
                    }
                }
                ajax(params, true);
            },
            // 家居情况选择
            chooseMore(index, key,item){
                if(window.gtag){
                    window.gtag('event', `${item.questionNumber.toLowerCase()}-finish`, {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                }
                //根据 index，key 给对应的 question 设置 start 状态
                var ques = this.questions[index];
                ques.possibleValues[key].start = !ques.possibleValues[key].start;
                //重新存入 questions
                this.questions[index] = ques;
                //将数据存入 session 当中
                setQuestions(ques, 2);
                //重新调用接口
                this.getData(getQuestionsAll(getQuestions(),2));
            },
            // 单选框选择
            chooseMedicine(index, key,item){
                if(window.gtag){
                    window.gtag('event', `${item.questionNumber.toLowerCase()}-finish`, {
                        'event_category' : this.$gategory.toLowerCase(),
                        'event_label' : this.$path.toLowerCase()
                    });
                }
                //根据 index 获取对应的 question 并改变 start 的状态
                var ques = this.questions[index];
                if(ques.possibleValues){
                    for(let i=0; i<ques.possibleValues.length; i++){
                        if(i === key){
                            if(ques.possibleValues[i].start){
                                return;
                            }else{
                                ques.possibleValues[i].start = true;
                            }
                        }else{
                            ques.possibleValues[i].start = false;
                        }
                    }
                }
                //将新的选择存入 session 中
                setQuestions(ques, 2);
                //重新调用接口
                this.getData(getQuestionsAll(getQuestions(),2))
            },
            setOther(index){
                setQuestions(this.questions[index], 2);
            },
            // 选择地址页面
            address(item){
                this.$router.push({
                    name:"addre",
                    params:{lang:this.$i18n.locale}
                })
                setSession("address", item);
            },
            // 服务时段页
            time(item){
                this.$router.push({
                    name:"aboutTime",
                    params:{lang:this.$i18n.locale}                    
                })
                if(!getSession("dates")){
                    setSession("dates",item);
                }
            },
            setText(index){
                setQuestions(this.questions[index], 2);
                //重新调用接口
                this.getData(getQuestionsAll(getQuestions(),2))
            },
            // 一般服务流程弹框
            maskBtn(){
                this._data.mask = true;
            },
            down(){
                this._data.mask = false;
            },
        }
    }
</script>