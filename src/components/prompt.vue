<template>
    <div class="prompt" v-show="promptbool">
        <div class="prompt-box">
            <div class="prompt-title" v-if="title">{{title}}</div>
            <div class="prompt-title" v-else>{{ $t('message.prompt.title') }}</div>
            <div class="prompt-cont">{{content}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data(){
        return{
            promptbool: false,
            title: "",
            content: "",
        }
    },
    mounted(){
        this.$root.eventHub.$on('showprompt', (item) => {
            this.promptbool = true;
            if(item.title){
                this.title = item.title
            }
            this.content = item.content;
            setTimeout(()=>{
                if(item.callback){
                    item.callback();                    
                }
                this.promptbool = false;                
            },item.time?item.time:1500)
        });
    },
}
</script>

