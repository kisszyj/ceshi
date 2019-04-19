<template>
    <div class="posit-box">
      <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:'服務記錄',start:true}"></head-top>
      <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
        <div class="serviceRecord">
          <div class="service-list">
            <div class="service-item" v-for="item in schedules">
              <div class="service-content">
                <div class="service-top">
                  <div class="service-top-name">{{item.categoryLabel}}</div>
                  <div class="service-top-enable">{{item.statusLabel}}</div>
                </div>
                <div class="service-box">
                  <div class="service-title">服务人员：</div>
                  <div class="service-text">
                    <span v-for="(supplier,index) in item.suppliers">
                      {{supplier.name}}
                      <span v-if="item.suppliers.length-1 !== index">，</span>
                    </span>
                  </div>
                </div>
                <div class="service-box">
                  <div class="service-title">服務時段 :</div>
                  <div class="service-text">{{item.startDate}}</div>
                </div>
              </div>
              <div class="service-button" v-if='item.status === "U"'>評價是次服務</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import { ajax , PackageId } from '@/util/util'    
    export default {
        name: 'serviceRecord',
        data() {
            return {
                schedules:[],
            };
        },
        components:{
            headTop:headTop,
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
          const {params: {projectId}} = this.$route;
          this.init(projectId)
        },
        methods:{
            changeBack(){
                this.$router.back(-1)
            },
            init(projectId){
                var params = {
                    url:`/api/project/${projectId}/schedules`,
                    type:"get",
                    success:res=>{
                        this.schedules = res.data;
                    }
                }
                ajax(params);
            }
        },
        
    }
</script>