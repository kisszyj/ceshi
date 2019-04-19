<template>
    <div class="posit-box">
        <head-top v-if="!$alipayBool"  @backClick="changeBack" v-bind:data="{title:$t('message.head.address'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
            <div class="address scoll">
                
                <div class="address-title">{{ $t("message.about.newAddre") }}</div>
                <div class="add" @click="adderssBtn" >
                    <div class="address-icon"  :class="start?'start':''"></div>
                    <div class="add-box">
                        <div class="add-item">
                            <div class="add-title">{{ $t("message.input.name") }}</div>
                            <div class="add-input">
                                <input type="text" v-model="name" maxlength="50" :placeholder="$t('message.placeholder.name')" />
                            </div>
                        </div>
                        <div class="add-item">
                            <div class="add-title">{{ $t("message.input.phone") }}</div>
                            <div class="add-input phone">
                                <span>+852</span>
                                <input type="Number" v-model="phone" :placeholder="$t('message.placeholder.phone')" />
                            </div>
                        </div>
                        <div class="add-item">
                            <div class="add-title">{{ $t("message.input.email") }}</div>
                            <div class="add-input">
                                <input type="text" maxlength="100" v-model="email" :placeholder="$t('message.placeholder.email')" />
                            </div>
                        </div>
                        <div class="add-item">
                            <div class="add-title">{{ $t("message.input.addre") }}</div>
                            <div class="add-input" type="">
                                <vue-google-autocomplete  ref="address" id="map" v-model="address" classname="form-control" v-on:change="googleChange" :placeholder="$t('message.placeholder.addre')" v-on:placechanged="getAddressData" types="geocode" :country="['HK']"></vue-google-autocomplete>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="address-title" v-if="total > 0">{{ $t("message.about.usedAddre") }}</div>
                <div class="address-list">
                    <div class="address-item" v-for="(item,index) in list" @click="adderssBtn(index)">
                        <div class="adderss-left">
                            <div class="address-icon" :class="item.start?'start':''"></div>
                            <div class="address-content">
                                <div class="address-name" v-if="item.contact">{{ item.contact }}</div>
                                <div class="address-text" v-if="item.phone">{{ item.phone }}</div>
                                <div class="address-text" v-if="item.email">{{ item.email }}</div>
                                <div class="address-text">{{ item.address }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>
            </div>
        </div>
        <div class="btn-box">
            <div class="btn" v-if="btnStart" @click="addBtn">{{ $t('message.btn.mine2')}}</div>
            <div class="btn disabled" v-else >{{ $t('message.btn.mine2') }}</div>            
        </div>   
    </div>
</template>
<script>
    import headTop from "../../components/headTop";
    import {ajax,setSession,getSession,PackageId,setQuestions} from "@/util/util";
    import VueGoogleAutocomplete from 'vue-google-autocomplete'

    export default {
        name: 'addre',
        components:{
            headTop,
            VueGoogleAutocomplete,
        },
        data() {
            return {
                list:[],
                start:false,
                total:"",
                name:"",
                phone:"",
                address:"",
                email:"",
                btnStart:false,
                msg:"",   
                googleImput:"",             
            };
        },
        created(){
            if(!this.$path){
                PackageId(this);
            }
            const { params:{lang} } = this.$route;
            this.$i18n.locale=lang;
            if(this.$alipayBool){
                AlipayJSBridge.call("setTitle", {
                    title: this.$t('message.head.address'),
                    subtitle: ""
                });
            }
        },
        mounted(){
            const { path } = this.$route;
            this.gaGoogle(path);
            this.getDate();
            this.getBtn();
        },
        methods:{
            /**goodle地址数据加载
            * @param {Object} addressData 
            * @param {Object} placeResultData 
            * @param {String} id 
            */
            // google数据监听
            getAddressData: function (addressData, placeResultData, id) {
                this.address = placeResultData.formatted_address;
            },
            googleChange(value) {
                this.address = value;
            },
            changeBack(){
                this.$router.back(-1)
            },
            // 获取地址数据
            getDate(){
                var params = {
                    url:"api/address",
                    type:"get",
                    success:res=>{
                        this._data.total = res.data.totalCount;
                        if(res.data.totalCount > 0){
                            var data = res.data.addresses;
                            for(var i=0; i<data.length; i++){
                                data[i].start = false;
                            }
                            this._data.list = data;
                        }else{
                            this.start = true;
                        }
                         
                    }
                }
                ajax(params);
            },
            // 判断按钮是否可以点击
            getBtn(){
                if(this.isStart()){
                    this._data.btnStart = true;
                }else if(this._data.start){
                    this._data.btnStart = true;                    
                }else{
                    this._data.btnStart = false;                                        
                }
            },
            // 添加地址
            addDate(){
                var data = this._data;
                var reg = /^([4-6][0-9]|7[0-3]|8[1-3]|9[0-9])\d{6}$/;
                var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                if(!data.name){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.placeholder.name'),
                    });
                    return;
                }
                if(!data.phone){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.placeholder.regphone'),
                    });
                    return;
                }else{
                    if(!reg.test(data.phone)){
                        this.$root.eventHub.$emit("showprompt",{
                            content:this.$t('message.placeholder.regphone'),
                        });
                        return;
                    }
                }
                if(!email.test(data.email)){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.placeholder.regemail'),
                    });
                    return;
                }
                if(!data.address){
                    this.$root.eventHub.$emit("showprompt",{
                        content:this.$t('message.placeholder.regaddre'),
                    });
                    return;
                }
                var params = {
                    url:"api/address",
                    type:"post",
                    data:{
                        address:data.address,
                        email:data.email,
                        contact:data.name,
                        phone:data.phone,
                    },
                    success:res=>{
                        let address = getSession("address");
                        res.data.questionNumber = address.questionNumber;
                        res.data.shortLabel = address.shortLabel;
                        res.data.type = address.type;
                        setQuestions(res.data, 2);
                        this.$router.back(-1);  
                        if(window.gtag){
                            window.gtag('event', `${res.data.questionNumber.toLowerCase()}-finish`, {
                                'event_category' : this.$gategory.toLowerCase(),
                                'event_label' : this.$path.toLowerCase()
                            });
                        }                  
                    }
                }
                ajax(params);
            },
            // 选择地址
            adderssBtn(index){
                var list = this._data.list;
                for(var i=0; i<list.length; i++){
                    list[i].start = false;
                }
                this._data.start = false;      
                if(!isNaN(index)){
                    list[index].start = true;
                }else{
                    this._data.start = true;                            
                }
                this.getBtn();
            },
            //点击使用或添加地址
            addBtn(){
                var is = this.isStart();
                if(is){
                    setQuestions(is, 2)
                    this.$router.back(-1);
                    if(window.gtag){
                        window.gtag('event', `${is.questionNumber.toLowerCase()}-finish`, {
                            'event_category' : this.$gategory.toLowerCase(),
                            'event_label' : this.$path.toLowerCase()
                        });
                    }
                }else if(this._data.start){
                    this.addDate();
                }           
            },
            // 遍历数据
            isStart(){
                let address = getSession("address");
                var list = this._data.list;
                for(var i=0; i<list.length; i++){
                    if(list[i].start){
                        list[i].questionNumber = address.questionNumber;
                        list[i].shortLabel = address.shortLabel;
                        list[i].type = address.type;
                        return list[i];
                    }
                }
                return false;
            },
        }
    }

    
</script>