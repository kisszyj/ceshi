<template>
  <div class="notice">
    <div class="rows">
      <ul class="marquee-list" ref="rows">
        <li>
          <div ref="rowsWidth" class="rows-animate">
            <div class="rows-item">
              <i class="rows-icon" :style="{backgroundImage:'url('+require('../img/icon-info.png')+')'}"></i>
              <span>{{data.text}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'crollNotice',
  props:["data"],
  data() {
    return {
    }
  },
  created() {
    
  },
  mounted() {
    this.$nextTick(() => {
      this.startAnimat()
    })
  },
  methods: {
    startAnimat() {
      let dom = this.$refs.rowsWidth
    },
    timerInit() {
      if(this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.rowNum += 1;
      }, 8000);
    },
    rowsScroll() {
      let rows = this.$refs.rows
      let rowsWidth = this.$refs.rowsWidth
    },
  }
}
</script>
<style scoped>

.notice{height: 32px;background-color: #FFE9EB;padding:8px;}
.notice .rows,.columns{width: 100%;overflow: hidden;}
.notice .marquee-list{display: flex;flex-direction: column;width: 100%;}
.notice .marquee-list li{flex-shrink: 0;width: 100%;overflow: hidden;}
.notice .rows-item{display:flex;align-items: center;font-size: 14px;color: #FF5C6C;line-height:16px;}
.notice .rows-icon{width: 16px;height: 16px;margin-right: 8px;background-size: 100% 100%;flex-shrink: 0;}
.rows-animate {
  padding-left: 20px;
  font-size: 12px;
  color: #000;
  display: inline-block;
  white-space: nowrap;
  animation: 10s wordsLoop linear infinite normal;
}
 
@keyframes wordsLoop {
  0% {
    transform: translateX(200px);
    -webkit-transform: translateX(200px);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

</style>
