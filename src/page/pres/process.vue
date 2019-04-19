<template>
    <div class="posit">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:process.service_flow_title,start:true}"></head-top>
        <div class="posit"  :class="{'addTopHeight': !($alipayBool)}">
        <div class="process scoll">
            <div class="process-prompt" v-if="process.service_flow_description">{{process.service_flow_description}}</div>
            <div class="process-list">
                <div class="process-itme" v-for="(item, index) in process.cleaning_step">
                    <div class="process-title">
                        <!-- <div class="process-icon" :style="item.image?('background-image:url('+item.image+')'):''"></div> -->
                        <img class="process-icon" v-lazy="item.image" alt="" v-if="item.image">
                        <div class="title-text">{{item.title}}</div>
                    </div>
                    <div class="process-text" v-for="ite in item.description">
                        <i></i>
                        <span>{{ite}};</span>
                    </div>
                </div>
            </div>
            <div class="app-foor foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>    
        </div>
        </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import { ajax , PackageId} from '@/util/util'
    export default {
        name: 'process',
        components:{
            headTop:headTop,
        },
        data() {
            return {
                process:'',
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            const {params: {packageNumber}} = this.$route;
            this.getCms(packageNumber);        
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
            getCms(packageNumber){
                let _this = this;
                var params = {
                    url:"cms/prismic/alipay/direct-service?packageId="+ packageNumber+"&locale="+ this.$i18n.locale,
                    type:"get",
                    success:res=>{
                        // if(res.result.cleaning_step.length>=0) {
                        //     for(let i=0; i<res.result.cleaning_step.length; i++) {
                        //         if(res.result.cleaning_step[i].image && res.result.cleaning_step[i].image.indexOf('staticfiles3') >= 0) {
                        //             res.result.cleaning_step[i].image = res.result.cleaning_step[i].image +'!ali-m';
                        //         }
                        //     }
                        // }
                        this._data.process = res.result;
                        if(this.$alipayBool){
                            AlipayJSBridge.call("setTitle", {
                                title: res.result.service_flow_title,
                                subtitle: ""
                            });
                        }
                    }
                }
                ajax(params, true);
            },
            setClass(val, index){
                return val + (index + 1);
            }
        }
    }
</script>