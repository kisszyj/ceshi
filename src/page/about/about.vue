<template>
    <div class="posit-box">
        <head-top v-if="!$alipayBool && $isMobile"  @backClick="changeBack" v-bind:data="{title:$t('message.head.about'),start:true}"></head-top>
        <question-head-web v-if="!$isMobile" v-bind:data="{title:$t('message.head.about'),level:level}" ></question-head-web>
        <div class="line" :class="{'addLine': !($alipayBool)}" v-if="$isMobile">
            <div class="line-start"  :style="'width:'+ level +'%' "></div>
        </div>
        <div class="posit">
            <div class="aboutBox" :class="{'addTopHeight': !($alipayBool) && $isMobile }">
                <div class="about scoll">
                    <div  v-for="(item, index) in questions">
                        <div class="about-item" v-if="item.type==='ENUMERATION' && !item.multiple">
                            <div>
                                <div class="about-top" :style="item.subLabel?'padding: 16px 8px 0;':''">
                                    <div class="top-left ques-icon">
                                        <img v-if="$isMobile" src="../../img/ecology-and-environment@3x.png" />
                                        <span v-if="!$isMobile">{{index+1}}.</span>
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
                                    <div class="top-left ques-icon">
                                        <img v-if="$isMobile" src="../../img/ecology-and-environment@3x.png" />
                                        <span v-if="!$isMobile">{{index+1}}.</span>
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

                        <!-- 新增question图片多选 -->
                        <div class="about-item" v-if="item.type==='IMAGENUMBER'">
                          <div>
                            <div class="about-top" :style="item.subLabel?'padding: 16px 8px 0;':''">
                              <div class="top-left ques-icon">
                                    <img v-if="$isMobile" src="../../img/ecology-and-environment@3x.png" />
                                    <span v-if="!$isMobile">{{index+1}}.</span>
                                    <span>{{item.label}}</span>
                              </div>
                              <div class="top-right"></div>
                            </div>
                            <div v-if="item.subLabel" class="date-text">{{item.subLabel}}</div>
                          </div>
                          <div class="clothing" v-for="(ite,key) in item.possibleValues">
                            <div class="box-left">
                              <img :src="ite.imageLabel">
                              <div class="box-sub">
                                <p>{{ite.label}}</p>
                                <span>$56/{{ite.unit}}</span>
                              </div>
                            </div>
                            <div class="date-right box-right" v-if="ite.maxValue !== 1">
                              <div class="date-subtract ation-img"  :class="(ite.initValue>ite.minValue)?'':'gray'" @click="subtractImg(index,key)"></div>
                              <div class="cloth-num">{{ite.initValue}}</div>
                              <div class="date-add ation-img" :class="(ite.initValue<ite.maxValue)?'':'gray'" @click="addImg(index,key)"></div>
                            </div>
                            <div class="box-right" v-if="ite.maxValue === 1">
                              <div class="ation-img" @click="radioImg(index,key)" :style="ite.initValue?{backgroundImage:'url('+require('../../img/Group_Red.png')+')'}:{backgroundImage:'url('+require('../../img/Group.png')+')'}" ></div>
                            </div>
                          </div>
                        </div>

                        <div class="about-item aboutDate-date" v-if="item.type==='NUMBER'">
                            <div class="date-left ques-icon">
                                <img v-if="$isMobile" src="../../img/ecology-and-environment@3x.png" />
                                <span v-if="!$isMobile">{{index+1}}.</span>
                                <span>{{item.label}}</span>
                            </div>
                            <div v-if="item.subLabel" class="date-text">{{item.subLabel}}</div>
                            <div class="aboutDate-box">
                                <div class="date-right">
                                    <div class="date-subtract" :class="(item.initValue>item.minValue)?'':'gray'" @click="subtractTime(index)"></div>
                                    <div class="date-tiem">{{item.initValue}} {{ $t("message.about.hours") }}</div>
                                    <div class="date-add" :class="(item.initValue<item.maxValue)?'':'gray'" @click="addTime(index)"></div>
                                </div>
                            </div>
                        </div>
                        <div class="about-item" v-if="item.type==='TEXT'">
                            <div>
                                <div class="about-top" :style="item.subLabel?'padding: 16px 8px 0;':''">
                                    <div class="top-left ques-icon">
                                        <img v-if="$isMobile" src="../../img/ecology-and-environment@3x.png" />
                                        <span v-if="!$isMobile">{{index+1}}.</span>
                                        <span>{{item.label}}</span>
                                    </div>
                                </div>
                                <div v-if="item.subLabel" class="date-text" style="padding: 4px 8px 16px;">{{item.subLabel}}</div>
                            </div>
                            <div class="textInput">
                                <input type="text" v-model.trim="item.value" @change="setText(index)" :placeholder="item.placeholder" cursor-spacing="30"/>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tipbox" v-if='$isMobile'>
                        <div class="tipitem" v-for="(item,index) in tipList" v-if="item.tipTitle">
                            <div class="tiptop">
                                <div class="tiptel">{{item.tipTitle}}</div>
                                <div class="tipicon" :class="item.start?'reducestart':'addstart'" @click="subtractFun(index)"></div>
                            </div>
                            <div class="tipmes" v-show="item.start">{{item.tip}}</div>
                        </div>
                    </div>
                    <div class="app-foor" v-if='$isMobile'><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
                    
                    <!-- web btn -->
                    <div class="aboutWebBtn" v-if='!$isMobile'>
                        <div class="web-back" @click="changeBack">
                            <i class="web-back-icon" :style="{backgroundImage:'url('+require('../../img/icon-arrow-left.png')+')'}"></i>
                            <span>{{ $t("message.head.fanhui") }}</span>
                        </div>
                        <div class="web-btn">
                            <div class="webBtn" v-if="butnStart" @click="next">{{ $t("message.btn.next") }}</div>
                            <div class="webBtn disabled" v-else>{{ $t("message.btn.next") }}</div>
                        </div>
                    </div>     
                </div>
                <div class="aboutWebRight" v-if='!$isMobile'>
                    <div class="tipbox">
                        <div class="tipitem" v-for="(item,index) in tipList" v-if="item.tipTitle">
                            <div class="tiptop">
                                <div class="tiptel">{{item.tipTitle}}</div>
                                <div class="tipicon" :class="item.start?'reducestart':'addstart'" @click="subtractFun(index)"></div>
                            </div>
                            <div class="tipmes" v-show="item.start">{{item.tip}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-box" style="border-top: 1px solid #cdcdcd;" v-if='$isMobile'>
            <div class="btn" v-if="butnStart" @click="next">{{ $t("message.btn.next") }}</div>
            <div class="btn disabled" v-else>{{ $t("message.btn.next") }}</div>
        </div>      
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import questionHeadWeb from "../../components/questionHeadWeb";
    import {ajax,getQuestionsAll,setQuestions,getQuestions,PackageId,clearQuestionItem,setSession} from "@/util/util";
    export default {
        name: 'about',
        components:{
            headTop:headTop,
            questionHeadWeb:questionHeadWeb,
        },
        data() {
            return {
                level:40,
                start:false,
                isiOS:false,
                questions: [],
                butnStart: false,
                tipList:[],
                tipStart:true,
            };
        },
        created(){
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            this.isiOS = isiOS;
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(this.$alipayBool){//Alipay客户端
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.about'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            if(getQuestions()){
                var datas = getQuestionsAll(getQuestions(),1);
                this.getDate(datas, true);
                
            }else{
                this.getDate({}, true);    
            }  
        },
        methods:{
            subtractFun(index){// Tip 的 message 是否显示
                this.tipList[index].start = !this.tipList[index].start;
            },
            // 返回需清除问答缓存
            changeBack(){             
                this.$router.back(-1)
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
                setQuestions(ques, 1);
                //重新调用接口
                this.getDate(getQuestionsAll(getQuestions(),1), true)
            },
            // 获取数据
            getDate(data, loading){
                // 获取地址信息
                var path = this.$path;
                var params = {
                    url:"api/package/direct/"+ path +"/questions",
                    data:data,
                    loading: loading,
                    type:"post",
                    success:res=>{
                        var arr = res.data.questions || [];
                        //获取 session 中的 questions 并判断是否为空
                        var questionsSe = getQuestions() || [];
                        let nums = 0;
                        for(let i=0; i<arr.length; i++){
                            if(this.tipStart){
                                if(arr[i].tipTitle && nums===0){
                                    arr[i].start = true;
                                    nums++;
                                }else{
                                    arr[i].start = false;
                                }
                            }

                            if(arr[i].type==="ENUMERATION"){//单选状态，start至多一个为true，单选状态必须存session，多选非必存
                                //判断 session 中是否存已选中状态
                                if(questionsSe.length){
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
                            
                            //判断 session 中服务时数是否存在
                            if(arr[i].type==="NUMBER"){//服务时数,存在则就存入，必存项
                                arr[i].minValue = parseInt(arr[i].minValue)
                                arr[i].maxValue = parseInt(arr[i].maxValue)
                                arr[i].initValue = parseInt(arr[i].initValue)
                                if(questionsSe){
                                    for(let m=0; m<questionsSe.length; m++){
                                        if(arr[i].type===questionsSe[m].type && arr[i].questionNumber===questionsSe[m].questionNumber){//通过则表示 session 中已存在选中状态
                                            if(parseInt(questionsSe[m].initValue) >= arr[i].initValue){
                                                arr[i].initValue = questionsSe[m].initValue;
                                            }else if(parseInt(questionsSe[m].initValue) < arr[i].initValue){
                                                setQuestions(arr[i], 1)
                                                this.clearSesseion();
                                            }
                                            break;
                                        }else if((m+1) >= questionsSe.length){
                                            //当 session 中不存在，则说明被删除，则需要重新存入初始服务时数
                                            setQuestions(arr[i], 1)
                                        }
                                    }
                                }else{
                                    //首次加载，将服务时数存入 session
                                    setQuestions(arr[i], 1)
                                }
                            }

                            // 图片question
                            if(arr[i].type === "IMAGENUMBER"){
                                if(questionsSe.length){
                                   for(let m=0; m<questionsSe.length; m++){
                                        if(arr[i].type===questionsSe[m].type && arr[i].questionNumber===questionsSe[m].questionNumber){//通过则表示 session 中已存在选中状态
                                            if(questionsSe[m].possibleValues){
                                                for(let j=0; j<questionsSe[m].possibleValues.length; j++){
                                                    arr[i].possibleValues[j].minValue = parseInt(arr[i].possibleValues[j].minValue)
                                                    arr[i].possibleValues[j].maxValue = parseInt(arr[i].possibleValues[j].maxValue)
                                                    arr[i].possibleValues[j].initValue = questionsSe[m].possibleValues[j].initValue;
                                                }
                                            }
                                            break;
                                        }else if((m+1) >= questionsSe.length){
                                            if(arr[i].possibleValues){
                                                for(let j=0; j<arr[i].possibleValues.length; j++){
                                                    arr[i].possibleValues[j].minValue = parseInt(arr[i].possibleValues[j].minValue)
                                                    arr[i].possibleValues[j].maxValue = parseInt(arr[i].possibleValues[j].maxValue)
                                                    arr[i].possibleValues[j].initValue = 0;
                                                }
                                            }
                                        }
                                    }
                                }else{
                                   if(arr[i].possibleValues){
                                        for(let j=0; j<arr[i].possibleValues.length; j++){
                                            arr[i].possibleValues[j].minValue = parseInt(arr[i].possibleValues[j].minValue)
                                            arr[i].possibleValues[j].maxValue = parseInt(arr[i].possibleValues[j].maxValue)
                                            arr[i].possibleValues[j].initValue = 0;
                                        }
                                    } 
                                }
                            }

                            if(arr[i].type==="TEXT"){
                                if(questionsSe.length){
                                    for(let m=0; m<questionsSe.length; m++){
                                        if(arr[i].type===questionsSe[m].type && arr[i].questionNumber===questionsSe[m].questionNumber){
                                            if(questionsSe[m].value){
                                                arr[i].value = questionsSe[m].value;
                                            }
                                            break;
                                        }else{
                                            arr[i].value = "";
                                        }
                                    }
                                }else{
                                    arr[i].value = "";
                                }
                            }
                        }
                        //存入所有question;
                        this._data.questions = arr;
                        if(this.tipStart){
                            this.tipList = arr;
                            this.tipStart = false;
                        }
                        this.ifData();
                        // this.getgray();
                    },
                    error:res=>{
                        if(res.errorCode == "05001"){
                            myApp.$root.eventHub.$emit("showprompt",{
                                content:res.errorMessage,
                                callback:()=>{
                                    this.getDate({}, true, true)  
                                }
                            });
                        }else{
                            myApp.$root.eventHub.$emit("showprompt",{
                                content:res.errorMessage,
                            });
                        }
                    }
                }
                ajax(params)
            },
            // 家居情况选择
            chooseMore(index, key, item){
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
                setQuestions(ques, 1);
                //重新调用接口
                this.getDate(getQuestionsAll(getQuestions(),1), false);
            },
            setOther(index){
                setQuestions(this.questions[index], 1);
            },
            // 判断按钮能否点击
            ifData(){
                var ques = this.questions;
                let change = 0,start=0;
                for(let i=0; i<ques.length; i++){
                    if(ques[i].required && ques[i].type !== "NUMBER"){
                        ++change;
                        if(ques[i].type === "ENUMERATION" || ques[i].type === "IMAGENUMBER"){
                            for(let j=0; j<ques[i].possibleValues.length; j++){
                                if(ques[i].possibleValues[j].start || ques[i].possibleValues[j].initValue){
                                    ++start;
                                    break;
                                }
                            }
                        }
                        if(ques[i].type === "TEXT"){
                            if(ques[i].value){
                                ++start;
                            }
                        }
                    }
                }
                if(change === start){
                    this.butnStart = true;
                }else{
                    this.butnStart = false;
                }
                return change === start;
            },
            // 时间减
            subtractTime(index){
                if(this.questions[index].minValue < this.questions[index].initValue){//当 initValue 小于 最小时数 是才执行
                    if(window.gtag){
                        window.gtag('event', `${this.questions[index].questionNumber.toLowerCase()}-finish`, {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                    //根据 index 修改对应 question 的 initValue 值
                    this.questions[index].initValue--;
                    //存入 session
                    setQuestions(this.questions[index], 1)
                    this.clearSesseion();
                }
                return; 
            },
            // 时间加
            addTime(index){
                if(this.questions[index].maxValue > this.questions[index].initValue){
                    if(window.gtag){
                        window.gtag('event', `${this.questions[index].questionNumber.toLowerCase()}-finish`, {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                    //根据 index 修改对应 question 的 initValue 值
                    this.questions[index].initValue++;
                    //存入 session
                    setQuestions(this.questions[index], 1)
                    this.clearSesseion();
                }
                return;
            },
            // question 图片 减
            subtractImg(index,key){
                if(this.questions[index].possibleValues[key].minValue < this.questions[index].possibleValues[key].initValue){//当 initValue 小于 最小时数 是才执行
                    if(window.gtag){
                        window.gtag('event', `${this.questions[index].questionNumber.toLowerCase()}-finish`, {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                    //根据 index 修改对应 question 的 initValue 值
                    this.questions[index].possibleValues[key].initValue--;
                    //存入 session
                    setQuestions(this.questions[index], 1)
                    this.getDate(getQuestionsAll(getQuestions(),1), false);
                }
                return; 
            },
            // question 图片 加
            addImg(index,key){
                if(this.questions[index].possibleValues[key].maxValue > this.questions[index].possibleValues[key].initValue){//当 initValue 小于 最小时数 是才执行
                    if(window.gtag){
                        window.gtag('event', `${this.questions[index].questionNumber.toLowerCase()}-finish`, {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                    //根据 index 修改对应 question 的 initValue 值
                    this.questions[index].possibleValues[key].initValue++;
                    //存入 session
                    setQuestions(this.questions[index], 1)
                    this.getDate(getQuestionsAll(getQuestions(),1), false);
                }
                return; 
            },
            // 单选 图片 
            radioImg(index,key){
                if(this.questions[index].possibleValues[key].maxValue > this.questions[index].possibleValues[key].initValue){
                    this.questions[index].possibleValues[key].initValue++;
                }else if(this.questions[index].possibleValues[key].minValue < this.questions[index].possibleValues[key].initValue){
                    this.questions[index].possibleValues[key].initValue--;
                }
                setQuestions(this.questions[index], 1)
                this.getDate(getQuestionsAll(getQuestions(),1), false);
                return; 
            },
            clearSesseion(){
                //存在服务时段，则清除
                var ques = getQuestions();
                for(let i=0; i<ques.length; i++){
                    if(ques[i].type==="DATETIME"){
                        clearQuestionItem(ques[i].type);
                    }
                }
                setSession("dates", "");
            },
            setText(index){
                //将新的选择存入 session 中
                setQuestions(this.questions[index], 1);
                //重新调用接口
                this.getDate(getQuestionsAll(getQuestions(),1), true)
            },
            // 下一步
            next(){
                const ifData = this.ifData();
                if(!ifData){
                    return;
                }
                var ques = this.questions;
                let start = true;
                for(let i=0; i<ques.length; i++){
                    if(ques[i].type==="ENUMERATION"){
                        for(let j=0; j<ques[i].possibleValues.length; j++){
                            if(ques[i].possibleValues[j].start && ques[i].possibleValues[j].canDescribe){
                                if(ques[i].possibleValues[j].other == "" || ques[i].possibleValues[j].other == undefined){
                                    start = false;
                                    myApp.$root.eventHub.$emit("showprompt",{
                                        content:ques[i].possibleValues[j].label,
                                    });
                                }
                            }
                        }
                    }
                }
                if(start){
                    if(window.gtag){
                        window.gtag('event', 'next-step-1_clicked', {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                    this.$router.push({
                        name:"aboutDate",
                        params:{lang:this.$i18n.locale}
                    })
                }
                
            }
        }
    }
</script>