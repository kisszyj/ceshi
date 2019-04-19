<template>
  <div id="app">
    <router-view />
    <modal></modal>
    <prompt></prompt>
    <loading></loading>
  </div>
</template>

<script>
import modal from './components/modal'
import prompt from './components/prompt'
import loading from './components/loading'
import Swiper from 'swiper';
import {ajax, getCookie, setSession , getSession , getUrlVars} from "@/util/util"

  export default {
    name: 'App',
    components:{modal,prompt,loading},
    data(){
      return{
      }
    },
    mounted(){
      const packageId = getUrlVars().packageId;
      if(packageId){
        this.setPath(packageId);
        setSession("packageId",packageId)
      }
      if(!packageId && !getSession("packageId")){
        this.setPath("HCHOO-PKG-3");
        setSession("packageId","HCHOO-PKG-3")
      }
      // this.$nextTick(function () {
      //   this.setStatus();
      // })
      if ((/Android/gi).test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || 
                document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });
      }
      if(/AlipayClient/.test(window.navigator.userAgent)){
        this.setAlipay(true);
        this.setGategory("alipay-direct");
      }
    },
    methods:{
      // setStatus(){
      //   var params = {
      //     url: "api/project/status",
      //     type: "get",
      //     success: res => {
      //       for(let item in res.data.directUnviewed){//判斷是否存在未查看的新信息
      //         if(res.data.directUnviewed[item]>0){
      //           this.setStatusicon(item,true);
      //         }
      //       }
      //       console.log(this.$statusicon)
      //     }
      //   }
      //   ajax(params);
      // }
    },
    
  }
</script>

