<template>
    <div class="questionHeadWeb">
        <div class="question-head">
            <div class="question-logo logo" :style="{backgroundImage:'url('+require('../img/hellotoby-logo.png')+')'}"></div>
            <div class="question-consent">
                <div class="question-title">{{data.title}}</div>
                <div class="question-line" v-if="data.level">
                    <div class="line-state" :style="'width:'+ data.level +'%' "></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:"questionHeadWeb",
        props:["data"],
        data(){
            return{
                total:"",
            }
        },
    }

</script>