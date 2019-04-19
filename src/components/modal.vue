<template>
    <div class="modal" v-if="modalbool">
        <div class="modal-box">
            <div class="modal-titel">{{titel}}</div>
            <div class="modal-cont">{{contents}}</div>
            <div class="modal-btn">
                <button @click="backService">{{btncont}}</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'modal',
    data(){
        return{
            titel: "",
            contents: "",
            btncont: "",
            modalbool: false,
        }
    },
    mounted(){
        this.$root.eventHub.$on('showmodal', (item) => {
            this.modalbool = true;
            this.titel = item.titel;
            this.contents = item.contents;
            this.btncont = this.$t('message.btn.detail');
            this.id = item.projectId;
        });
    },
    methods: {
        backService(){
            this.modalbool = false;
            var actionArr = window.location.href.split("#");
            var action = actionArr[0];
            if(this.$isMobile){
                location.replace(action+"#/"+this.$i18n.locale+"/presDeta/"+this.id);
            }else{
                location.replace(action+"#/"+this.$i18n.locale+"/presDetaWeb/"+this.id);
            }
            // this.$router.push({
            //     name:'presDeta',
            //     params:{lang: this.$i18n.locale, projectId: this.id}
            // })
        }
    }
}
</script>
