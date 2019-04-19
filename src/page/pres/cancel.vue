<template>
    <div class="posit">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.head.cancel'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
        <div class="cancel scoll" v-if="dataMes.possibleValues">
            <div class="why">
                <div class="why-title ques-icon">
                    <i></i>
                    <span>{{ dataMes.label }}</span>
                </div>
                <div class="why-list">
                    <div class="why-item" v-for="(item,index) in dataMes.possibleValues" @click="whyBtn(index)">
                        <div class="why-top">
                            <i class="ation-icon" v-if="dataMes.multiple"  :class="item.start?'start':''"></i>
                            <i class="why-icon" v-else :class="item.start?'start':''"></i>
                            <span>{{ item.label }}</span>
                        </div>
                        <div class="why-text" v-on:click v-if="item.canDescribe">
                            <textarea  :class="className" :placeholder="item.placeholder?item.placeholder:''" v-model="item.other"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tipbox" v-if="dataMes">
                <div class="tipitem">
                    <div class="tiptop">
                        <div class="tiptel">{{dataMes.tipTitle}}</div>
                        <div class="tipicon" :class="dataMes.start?'reducestart':'addstart'" @click="subtractFun()"></div>
                    </div>
                    <div class="tipmes" v-show="dataMes.start">{{dataMes.tip}}</div>
                </div>
            </div>
            <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
        </div>
        </div>
        <div class="btn-box">
            <div class="btn" @click="cancellationfun">{{ $t('message.btn.mine') }}</div>
        </div>                           
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import {ajax,getQuestionsItem,dateFormat,getMonday,PackageId,getSession} from "@/util/util";

    export default {
        name: 'cancel',
        components:{
            headTop:headTop,
        },
        data() {
            return {
                num:8,
                list:[],
                sele: 0,
                whytxt: "",
                dataMes:{},
                className:"zh-hk",
                packageNumber: "",
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
                    title: this.$t('message.head.cancel'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            this._data.className = this.$i18n.locale;    
            if(this.$projectId){
                this.projectId = this.$projectId;
            }else if(getSession("projectId")){
                this.projectId = getSession("projectId");
            }
            this.getData();
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
            // 提交取消预约
            cancellationfun(){
                var data = this._data.dataMes;
                var datas = {
                    action:"CANCEL",
                    questions:[
                        {
                            questionNumber:data.questionNumber,
                            answers:[]
                        }
                    ]
                };
                // 获取取消预约原因
                for(var i=0; i<data.possibleValues.length;i++){
                    if(data.possibleValues[i].start){
                        var obj = {
                            value:data.possibleValues[i].value,
                        }
                        if(data.possibleValues[i].canDescribe){
                            if(data.possibleValues[i].other == undefined || data.possibleValues[i].other == ""){
                               this.$root.eventHub.$emit("showprompt",{
                                    content:data.possibleValues[i].label,
                                });
                                return;
                            }else{
                                obj.other = data.possibleValues[i].other;
                            }
                        }

                        datas.questions[0].answers.push(obj)                        
                    }
                }
                if(!datas.questions[0].answers.length){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this._data.data.label,
                    });
                    return;
                }
                this.ticket(datas);
            },
            // 取消预约
            ticket(data){
                var params = {
                    url:"api/project/"+ this.projectId +"/ticket",
                    type:"post",
                    data:data,
                    success:res=>{
                        var datas = {
                            titel:res.data.responseTitle,
                            contents:res.data.responseMessage,
                            projectId: this.projectId,
                        }
                        this.$root.eventHub.$emit('showmodal', datas);
                    }
                }
                ajax(params);
            },
            // 获取取消预约原因
            getData(){
                var params = {
                    url:"api/package/direct/"+ this.packageNumber +"/questions",
                    type:"post",
                    data:{
                        purpose:"CANCEL",
                        projectId:this.projectId,
                        questions:[],
                        pageNum:1,
                    },
                    success:res=>{
                        if(res.data.questions.length>0){
                            var data = res.data.questions[0];
                            for(var i=0; i<data.possibleValues.length; i++){
                                data.possibleValues[i].start = false;
                            }
                            data.start = true;
                            this._data.dataMes = data;
                        }
                    }
                }
                ajax(params);
            },
            //选择取消预约原因
            whyBtn(index){
                var list = this._data.dataMes.possibleValues;
                // if(!list[index].canDescribe){
                //     this._data.whytxt = "";                    
                // }
                // for(var i=0;i<list.length;i++){
                //     if(i!==index && list[i].canDescribe){
                //         list[i].other = "";
                //     }
                // }
                if(this._data.dataMes.multiple){
                    list[index].start = !list[index].start;                    
                }else{
                    for(var i=0; i<list.length; i++){
                        list[i].start = false;
                    }
                    list[index].start = true;                                        
                }
            },
            subtractFun(){
                this.dataMes.start = !this.dataMes.start;
            }
        }
    }
</script>
