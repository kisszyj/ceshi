<template>
    <div class="report posit">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.order.customer'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="report-box scoll">
                <div class="report-tel">{{tishi}}</div>
                <div class="report-opinion reportflex">
                    <div class="opinion-cont">
                        <div class="cont-tel ques-icon">
                            <i></i>
                            <span>{{$t('message.report.queries')}}</span>
                        </div>
                        <div class="cont-area">
                            <textarea :class="className"  v-model="text" id="" cols="30" rows="10" :placeholder="$t('message.report.placeholder2')"></textarea>
                        </div>
                    </div>
                </div>
                <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
        </div>
        <div class="btn-box">
            <div class="btn" @click="submitfun">{{ $t('message.report.btntxt') }}</div>
        </div> 
    </div>
</template>

<script>
import headTop from "../../components/headTop";
import { ajax, dateFormat, getMonday , PackageId} from '@/util/util';

export default {
    name: "contact",
    components:{
        headTop:headTop,
    },
    data(){
        return{
            text:"",
            className:'zh-hk',
            tishi:"",
            projectId: "",
        }
    },
    created(){
        if(!this.$path){
            PackageId(this);
        }
        const { params:{lang} } = this.$route;
        this.$i18n.locale=lang;
        if(this.$alipayBool){
            AlipayJSBridge.call("setTitle", {
                title: this.$t('message.order.customer'),
                subtitle: ""
            });
        }
    },
    mounted() {
        const { path } = this.$route;
        this.gaGoogle(path);
        this._data.className = this.$i18n.locale;
        const { params: { id, projectId } } = this.$route;
        if(id==0){
            this._data.tishi = this.$t('message.report.teltxt3')
        }else if(id==2){
            this._data.tishi = this.$t('message.report.teltxt4')
        }else{
            this._data.tishi = this.$t('message.report.teltxt2')
        }
        if(projectId){
            this.projectId = projectId;
        }
    },
    methods:{
        changeBack(){
            this.$router.back(-1)
        },
        submitfun(){
            if(!this.text){
                myApp.$root.eventHub.$emit("showprompt",{
					content:this.$t('message.report.placeholder2'),
				});
                return
            }
            var datas = {
                code:"askq",
                data:{
                    reason:this.text, 
                }
            }

            var params = {
                url:"api/event",
                type:"post",
                data:datas,
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
        }
    }
}
</script>
