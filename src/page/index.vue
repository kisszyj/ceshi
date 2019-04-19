<template >
  <div class="index"  v-bind:lang="lang">
      <!-- <detail></detail> -->
      <detail-page></detail-page>
      
        <!--<prince :is="current" keep-alive></prince>      -->
      <!--<div class="tab">
        <div class="tab-item" @click="tabClick('door')">
          <div class="tab-icon"></div>
          <div class="tab-text">{{ $t('message.tab.index') }}</div>
        </div>
        <div class="tab-item" @click="tabClick('pres')">
          <div class="tab-icon"></div>
          <div class="tab-text">{{ $t('message.tab.pre') }}</div>
        </div>
      </div>-->
  </div>
</template>

<script>
// import door from "./door/door";
// import pres from "./pres/pres";
// import detail from './door/detail';
import detailPage from './door/detailPage';
import {setCookie, ajax, getCookie,getUrlVars} from '@/util/util';

export default {
  name: 'index',
  components:{
    // detail:detail,
    detailPage: detailPage,
  },
  data () {
    return {
      start:true,
      current:"door",
      lang:""
    }
  },
  created(){
    const { params:{lang} , path } = this.$route;
    this.gaGoogle(path);
    setCookie("nfcountry","HK",30)
    if(getUrlVars().access_token) {
      setCookie("nftoken",getUrlVars().access_token,30);
    }else if(getUrlVars().tnftoken) {
      setCookie("nftoken",getUrlVars().tnftoken,30);
    }else if(getUrlVars().nftoken) {
      setCookie("nftoken",getUrlVars().nftoken,30);
    }
    
    setCookie("localeId",lang?lang:this.$i18n.locale,30)
    if(lang == "en"){
      document.getElementsByTagName('body')[0].classList.add('en')        
    }else{
      document.getElementsByTagName('body')[0].classList.add('zh-hk')                
    }

    this.changeLanguage(lang?lang:this.$i18n.locale);
    if(!lang){
      this.$router.push({name: 'index', params: {lang:lang?lang:this.$i18n.locale}});             
    }
    if(this.$toggleTab){
      this._data.current = this.$toggleTab;
    }
  },
  methods:{
    changeLanguage(lang){
      console.log(lang)
      this.$i18n.locale=lang;
      this.lang=lang;
    },
    tabClick(start){
      this._data.current = start;
      this.settoggleTab(start);
      if(start == "pres"){
        this.setPresTab("all");                 
      }
    },
  }
}
</script>
