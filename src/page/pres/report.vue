<template>
    <div class="report posit">
        <head-top v-if="!$alipayBool" @backClick="changeBack" v-bind:data="{title:$t('message.order.complaints'),start:true}"></head-top>
        <div class="posit" :class="{'addTopHeight': !($alipayBool)}">
        <div class="report-box scoll">
            <div class="report-tel">{{$t('message.report.teltxt')}}</div>
            <div class="report-opinion reportflex">
                <div class="opinion-cont">
                    <div class="cont-tel ques-icon">
                        <i></i>
                        <span>{{$t('message.report.options')}}</span>
                    </div>
                    <div class="cont-area">
                        <textarea :class="className"  v-model="text" cols="30" rows="10" :placeholder="$t('message.report.placeholder')"></textarea>
                    </div>
                </div>
            </div>
            <div class="report-picture">
                <div class="report-top">
                    <div class="picture-tel ques-icon">
                        <i></i>
                        <span>{{$t('message.report.picture')}}</span>
                    </div>
                </div>
                <div class="report-bottom">
                    <div class="report-swiper">
                        <div class="report-slide" v-for="(item,index) in list">
                            <div class="picture-img" :style="item?('background-image:url('+item+')'):''">
                                <i @click="cancel(index)"></i>
                            </div>
                        </div>
                        <div class="report-slide" v-if="list.length < 10">
                            <form >
                                <div class="picture-img">
                                    <input type="file" class="uploadFile" name="mediaCategory"  @change="fileChange" accept="image/png,image/jpeg,image/jpg,image/bmp" />                                        
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="app-foor"><img class="toby-icon" src="../../img/Group2@3x(1).png" /></div>  
        </div>
        </div>
        <div class="btn-box">
            <div class="btn" @click="submitfun" >{{ $t('message.report.btntxt') }}</div>
        </div> 
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
import headTop from "../../components/headTop";
import { ajax, dateFormat, getMonday , PackageId, getSession} from '@/util/util';

export default {
    name: "report",
    components:{
        headTop:headTop,
    },
    data(){
        return{
            list:[],
            text:"",
            swiper:"",
            className:"zh-hk"
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
                title: this.$t('message.order.complaints'),
                subtitle: ""
            });
        }
    },
    mounted() {
        this._data.className = this.$i18n.locale;        
        var swiper = new Swiper('.swiper2', {
            slidesPerView: 4.2,
            spaceBetween: 10,
            freeMode: true
        });
        if(this.$projectId){
            this.projectId = this.$projectId;
        }else if(getSession("projectId")){
            this.projectId = getSession("projectId");
        }
    },
    methods:{
        changeBack(){
            this.$router.back(-1)
        },
        cancel(i){
            this._data.list.splice(i,1)
        },
        submitfun(){
            //
            if(!this.text){
                myApp.$root.eventHub.$emit("showprompt",{
					content:this.$t('message.report.placeholder'),
				});
                return
            }
            var datas = {
                code:"complain",
                data:{
                    reason:this.text,
                    medias:this.list, 
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
        },
        // fileChange(e){
        //     console.log(e.target.files[0])
        //     var formData = new FormData();
        //     formData.append('mediaCategory',"CST");  
        //     formData.append('mediaFile', e.target.files[0]);
        //     var params = {
        //         url: 'api/uploadfile',
        //         type: 'post',
        //         data: formData,
        //         uploadfile:true,
        //         dataType:"json",
        //         contentType:"multipart/form-data",
        //         timeout:1000000,
        //         success: (res) => {                 
        //             // console.log(res)
        //             var data = res.data;
        //             for(var i=0; i<data.length; i++){
        //                 this.list.push(data[i])                        
        //             }

        //             setTimeout(()=>{
        //                 // 数据渲染完成后开启评价滑动
        //                 var swiper = new Swiper('.swiper2', {
        //                     slidesPerView: 4.2,
        //                     spaceBetween: 10,
        //                     freeMode: true
        //                 });
        //             },100)
        //         }
        //     }
        //     ajax(params)
        // },
        fileChange(e){
            let _this = this;
            let swiper = new Swiper();
            if(e.target.files){
                let file = e.target.files[0];
                let reader = new FileReader();

                reader.readAsDataURL(file);

                reader.onloadend = function(e) {
                    let img = new Image();
                    img.src =  e.target.result;
                    img.onload = function() {
                        let data = _this.compress(img);
                        let blob = _this.dataURItoBlob(data);
                        
                        // let formData = new FormData();
                        // formData.append('mediaCategory',"CST");  
                        // formData.append('mediaFile', blob);
                        var params = {
                            url: 'api/uploadfile',
                            type: 'post',
                            data: blob,
                            uploadfile:true,
                            dataType:"json",
                            contentType:"multipart/form-data",
                            timeout:10000,
                            success: (res) => {                 
                                // console.log(res)
                                var data = res.data;
                                for(var i=0; i<data.length; i++){
                                    _this.list.push(data[i])                        
                                }
                                
                                setTimeout(()=>{
                                    // 数据渲染完成后开启评价滑动
                                    let swiper = new Swiper('.swiper2', {
                                        slidesPerView: 4.2,
                                        // spaceBetween: 10,
                                        freeMode: true
                                    });
                                },100)
                            }
                        }
                        ajax(params)
                    }
                }
            }
        },
        // 压缩图片
        compress(img) {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let initSize = img.src.length;
            let width = img.width;
            let height = img.height;
            canvas.width = width;
            canvas.height = height;
            // 铺底色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);

            //进行最小压缩
            let ndata = canvas.toDataURL("image/jpeg", 0.1);
            // console.log("*******压缩后的图片大小*******");
            return ndata;
        },
        // base64转成bolb对象
        dataURItoBlob(base64Data) {
            var byteString;
            if (base64Data.split(",")[0].indexOf("base64") >= 0)
                byteString = atob(base64Data.split(",")[1]);
            else byteString = unescape(base64Data.split(",")[1]);
            var mimeString = base64Data
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], { type: mimeString });
        }
    }
}
</script>

