<template>
    <div class="loading modal" v-show="loading">
        <div class="loading-box">
            <div class="loading-img"></div>
            <div class="loading-text">{{ $t('message.loading') }}...</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "",
        data(){
            return{
                text:"加载中...",
                loading:false,
            }
        },
        mounted(){
            this.$root.eventHub.$on('loading', (loading) => {
                this.loading = loading;
            });
        },
    }
</script>