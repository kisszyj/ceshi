<template>
    <div class="detailpage posit" >
      <!-- <head-top @preClick="changePre" v-bind:data="{title:datas.page_title,start:false,right:true}"></head-top> -->
      <div class="list-img">
        <div>
          <div class="img-height">
            <div class="img-box" v-for="item in datas.imageset">
              <img class="detail-img" v-lazy="item.imageurl" alt="">
            </div>
            <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
          </div>
        </div>
      </div>
      <div class="butn-fixed">
        <div class="butn-box">
          <div class="butn-left">
            <div class="discount" v-if="datas.original_price">{{ datas.original_price }}</div>
            <div class="price" v-if="datas.new_price">{{ datas.new_price }}</div>
          </div>
          <div class="butn-right" @click="about">
            <span class="top">{{ datas.call_to_action_button_label }}</span>
            <span class="botm" v-if="datas.call_to_action_description">{{ datas.call_to_action_description }}</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import headTop from "../../components/headTop";
  import {ajax,clearQuestions,PackageId,setSession,getUrlVars} from "@/util/util";
      
  export default {
    name: 'detailpage',
    components:{
        headTop:headTop,
    },
    data () {
      return {
        datas: {},
        refresh: "",
      }
    },
    created(){
      if(!this.$path){
        PackageId(this);
      }
      const { params:{lang} } = this.$route;
      this.refresh = (getUrlVars().refresh == true)?"&refresh=true":"";
      this.$i18n.locale=lang;
      //清空session
      clearQuestions();
      setSession("address", "");
      setSession("dates", "");
    },
    mounted(){
      this.getData();
      const { path } = this.$route;
      this.gaGoogle(path);
      if(window.gtag){
        window.gtag('event', 'product-page-enter', {
          'event_category' : this.$gategory.toLowerCase(),
          'event_label' : this.$path.toLowerCase()
        });
      }
    },
    methods:{
      setStatus(){
        var params = {
          url: "api/project/status",
          type: "get",
          success: res => {
            for(let item in res.data.directUnviewed){//判斷是否存在未查看的新信息
              if(res.data.directUnviewed[item]>0){
                this.setStatusicon(item,true);
              }
            }
          }
        }
        ajax(params);
      },
      //获取cms
      getData(){
          var params = {
            url:"cms/prismic/alipay/direct-service?packageId="+ this.$path+"&locale="+ this.$i18n.locale+this.refresh,
            type:"get",
            success:res=>{
              // if(res.result.imageset.length > 0) {
              //     for(let i=0; i<res.result.imageset.length; i++) {
              //         if(res.result.imageset[i].imageurl && res.result.imageset[i].imageurl.indexOf('staticfiles3') >= 0){
              //             res.result.imageset[i].imageurl = res.result.imageset[i].imageurl + '!ali-m';
              //         }
              //     }
              // }
              // if(res.result.cleaning_step.length > 0) {
              //     for(let i=0; i<res.result.cleaning_step.length; i++) {
              //         if(res.result.cleaning_step[i].image && res.result.cleaning_step[i].image.indexOf('staticfiles3') >= 0){
              //             res.result.cleaning_step[i].image = res.result.cleaning_step[i].image + '!ali-m';
              //         }
              //     }
              // }
              this.datas = res.result;
              if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: res.result.page_title,
                    subtitle: ""
                });
              }
              setSession("page_titel", res.result.page_title);
              setSession("cmsData", res.result);
            }
          }
          ajax(params, true);
      },
      // 立即预约
      about(){
        if(window.gtag){
          window.gtag('event', 'booking-cta-clicked', {
            'event_category' : this.$gategory.toLowerCase(),
            'event_label' : this.$path.toLowerCase()
          });
        }
        this.$router.push({
            name:"about",
            params: {lang: this.$i18n.locale},                    
        })
      },
      // 我的预约
      changePre(){
        this.$router.push({
            name:"pres",
            params: {lang: this.$i18n.locale},                    
        })
      },
    }
  }
</script>