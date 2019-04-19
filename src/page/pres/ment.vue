<template>
    <div class="posit">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:$t('message.head.ment'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="ment scoll">
                <div class="ment-select">
                    <div class="select-left ques-icon">
                        <i />
                        <span>評價服務</span>
                    </div>
                    <div class="select-right" @click="modalClick">
                        <span class="select-text">{{select?select:'请选择服务'}}</span>
                        <mobile-select :schedules="selectList" @changeSelect="changeSelect"  />
                    </div>
                </div>

                <div class="ment-star">
                    <div class="ment-item ment-total">
                        <div class="ment-left">
                            <div class="ment-title">{{ $t('message.ment.title.zhong') }}</div>
                            <div class="star-ment">
                                <i class="icon-star icon-star1" :class="total.num>=1?'start':''" @click="totalStar(1)"></i>
                                <i class="icon-star icon-star1" :class="total.num>=2?'start':''" @click="totalStar(2)"></i>
                                <i class="icon-star icon-star1" :class="total.num>=3?'start':''" @click="totalStar(3)"></i>
                                <i class="icon-star icon-star1" :class="total.num>=4?'start':''" @click="totalStar(4)"></i>
                                <i class="icon-star icon-star1" :class="total.num>=5?'start':''" @click="totalStar(5)"></i>                            
                            </div>
                            <div class="ment-right">{{ total.text }}</div>
                        </div>
                    </div>
                    <div class="ment-list" v-if=" total.num ">
                        <div class="ment-item" v-for="(item,index) in mentList">
                            <div class="ment-left">
                                <div class="ment-title">{{ item.title }}</div>
                                <div class="star-ment">
                                    <i class="icon-star icon-star1" :class="item.num>=1?'start':''" @click="itemStar(index ,1)"></i>
                                    <i class="icon-star icon-star1" :class="item.num>=2?'start':''" @click="itemStar(index ,2)"></i>
                                    <i class="icon-star icon-star1" :class="item.num>=3?'start':''" @click="itemStar(index ,3)"></i>
                                    <i class="icon-star icon-star1" :class="item.num>=4?'start':''" @click="itemStar(index ,4)"></i>
                                    <i class="icon-star icon-star1" :class="item.num>=5?'start':''" @click="itemStar(index ,5)"></i>                            
                                </div>
                            </div>
                            <div class="ment-right">{{ item.text }}</div>
                        </div>
                    </div>
                </div>
                <div class="ment-ping">
                    <div class="ping-title">
                        <div class="title-left ques-icon">
                            <i></i>
                            <span>{{ $t('message.ment.title.ping') }}</span>
                        </div>
                    </div>
                    <div class="title-right">{{menttxt.length}}/100</div>
                    <div class="ping-text">
                        <textarea :class="className" maxlength="100" :placeholder="$t('message.placeholder.ment')" v-model="menttxt"></textarea>
                    </div>
                    <div class="ping-list" v-if=" total.num ">
                        <div class="ping-item" v-for="(item, index) in list" @click="addmenttxt(item, index)">
                            <i></i>
                            <span>{{ item }}</span>
                        </div>
                    </div>
                </div>
                <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
                
            </div>

        </div>
        <div class="btn-box">
            <div class="btn" @click="submitfun">{{ $t('message.btn.mine') }}</div>
        </div> 
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import mobileSelect from "../../components/mobileSelect";
    import { ajax, dateFormat, getMonday , PackageId, getSession} from '@/util/util'
    export default {
        name: 'process',
        components:{
            headTop:headTop,
            mobileSelect:mobileSelect,
        },
        data() {
            return {
                num:8,
                list:[],
                total:{num:0,text:"",},
                mentList:[
                    {title:this.$t('message.ment.theme.speed'),
                        num:0,
                        text:"",
                    },
                    {
                        title:this.$t('message.ment.theme.clean'),
                        num:0,
                        text:"",
                    },
                    {
                        title:this.$t('message.ment.theme.attitude'),
                        num:0,
                        text:"",
                    },
                ],
                highpraise:this.$t('message.ment.highpraise'),
                badreview:this.$t('message.ment.badreview'),
                menttxt: "",
                suppliers: {},
                projectId: "",
                paramsindex: [],
                className:'zh-hk',
                selectList:[],
                select:"",
                modalbool:false,
                scheduleId:"",
            };
        },
        watch: {
            menttxt: function(newVal, oldVal){}
            
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.ment'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path , params:{projectId} } = this.$route;
            this.gaGoogle(path);
            if(this.$projectId){
                this.projectId = this.$projectId;
            }else if(getSession("projectId")){
                this.projectId = getSession("projectId");
            }
            if(projectId){
               this.projectId =  projectId;
            }
            this.init();
            this.getSchedules();
            this._data.className = this.$i18n.locale;
        },
        methods:{
            init(){
                var params = {
                    url: "api/review/tags",
                    type: "get",
                    success: res => {
                        this.suppliers = res.data.supplier;
                    }
                }
                ajax(params);
            },
            modalClick(){
		        this.$root.eventHub.$emit('showSelect')
            },
            changeSelect(schedule){
                this.scheduleId = schedule.id;
                this.select = schedule.startDate;
            },
            getSchedules(){
                const params = {
                    url:`/api/project/${this.projectId}/schedules?unreview=true`,
                    type:"get",
                    success:res=>{
                        this.selectList = res.data;
                    }
                }
                ajax(params);
            },
            changeBack(){
                this.$router.back(-1)
            },
            totalStar(num){
                this._data.total.num = num;
                this._data.total.text = this.text(num);
                if(num>=4){
                    if(this.$route.params.lang=="zh-hk"){
                        this.list = this.suppliers.compliments["zh-Hant-HK"];
                    }else{
                        this.list = this.suppliers.compliments.en;
                    }
                }else{
                    if(this.$route.params.lang=="zh-hk"){
                        this.list = this.suppliers.improvements["zh-Hant-HK"];
                    }else{
                        this.list = this.suppliers.improvements.en;
                    }
                }
            },
            itemStar(index,num){
                var mentList = this._data.mentList;
                mentList[index].num = num;
                mentList[index].text = this.text(num);
            },
            text(num){
                var text = "";
                switch(num){
                    case 1:text = this.$t("message.ment.score.not");
                        break;
                    case 2:text = this.$t("message.ment.score.general");                     
                        break;
                    case 3:text = this.$t("message.ment.score.satisfied");                    
                        break;
                    case 4:text = this.$t("message.ment.score.satisfied");                   
                        break;
                    case 5:text = this.$t("message.ment.score.very");                    
                        break;
                }
                return text;
            },
            submitfun(){
                let a = 0;
                var data = {
                    
                }
                for(let i=0;i<this.mentList.length;i++){
                    if(this.mentList[i].num===0){
                        a += 1;
                    }else{
                        data['subRate'+(i+1)] = this.mentList[i].num;
                        data['subRateName'+(i+1)] = this.mentList[i].title;
                    }
                }

                if(!this.scheduleId){
                   this.$root.eventHub.$emit('showprompt',{content:this.$t("message.placeholder.alert")});
                   return;
                }
                data.timeScheduleId = this.scheduleId;
                if(this.total.num===0  || this.menttxt=="" || a>0){
                    this.$root.eventHub.$emit('showprompt',{content:this.$t("message.placeholder.alert")});                    
                }else{
                    data.rate = this.total.num;
                    data.review = this.menttxt;
                    var params1 = {
                        url: "api/project/"+this.projectId+"/review",
                        type: "post",
                        data: data,
                        success: res => {
                            var datas = {
                                titel:res.data.responseTitle,
                                contents:res.data.responseMessage,
                                projectId: this.projectId
                            }
                            this.$root.eventHub.$emit('showmodal', datas);
                        }
                    }
                    ajax(params1);
                }
            },
            addmenttxt(val, index){
                if((this.menttxt + "，"+ val).length <= 100){
                    if(this.menttxt){
                        this.menttxt += "，"+val;                        
                    }else{
                        this.menttxt += val;
                    }
                }
            }
        }
    }
</script>