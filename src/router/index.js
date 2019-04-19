import Vue from 'vue'
import Router from 'vue-router'
// import index from '@/page/index'
// import dooritem from "@/page/door/dooritem"
// import detail from "@/page/door/detail"
// import presDeta from "@/page/pres/presDeta"
// import people from "@/page/pres/people"
// import process from "@/page/pres/process"
// import cancel from "@/page/pres/cancel"
// import modify from "@/page/pres/modify"
// import modifyTime from "@/page/pres/modifyTime"
// import ment from "@/page/pres/ment"
// import about from "@/page/about/about"
// import addre from "@/page/about/addre"
// import aboutDate from "@/page/about/aboutDate"
// import aboutTime from "@/page/about/aboutTime"
// import choose from "@/page/about/choose"
// import personnel from "@/page/about/personnel"
// import aboutDetail from "@/page/about/aboutDetail"
// import complete from "@/page/about/complete"

const index = resolve => require(['@/page/index'], resolve);
const pres = resolve => require(['@/page/pres/pres'],resolve);
// const dooritem = resolve => require(['@/page/door/dooritem'], resolve);
// const detail = resolve => require(['@/page/door/detail'], resolve);
const presDeta = resolve => require(['@/page/pres/presDeta'], resolve);
const people = resolve => require(['@/page/pres/people'], resolve);
const process  = resolve => require(['@/page/pres/process'], resolve);
const cancel = resolve => require(['@/page/pres/cancel'], resolve);
const modify = resolve => require(['@/page/pres/modify'], resolve);
const modifyTime = resolve => require(['@/page/pres/modifyTime'], resolve);
const ment = resolve => require(['@/page/pres/ment'], resolve);
const about = resolve => require(['@/page/about/about'], resolve);
const addre = resolve => require(['@/page/about/addre'], resolve);
const aboutDate = resolve => require(['@/page/about/aboutDate'], resolve);
const aboutTime = resolve => require(['@/page/about/aboutTime'], resolve);
// const choose = resolve => require(['@/page/about/choose'], resolve);
// const personnel = resolve => require(['@/page/about/personnel'], resolve);
const aboutDetail = resolve => require(['@/page/about/aboutDetail'], resolve);
const complete = resolve => require(['@/page/about/complete'], resolve);
const record = resolve => require(['@/page/pres/record'],resolve);
const report = resolve => require(['@/page/pres/report'], resolve);
const contact = resolve => require(['@/page/pres/contact'], resolve);
const serviceRecord = resolve => require(['@/page/pres/serviceRecord'],resolve);
const presDetaWeb = resolve => require(['@/page/pres/presDetaWeb'],resolve);


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {path: '*', redirect: "/zh-hk"}, 
    // {path: '*', redirect: "/en"},     
    {path: '/:lang',name: 'index',component: index,},
    // {path:"/:lang/dooritem",name:"dooritem",component:dooritem,},
    // {path:"/:lang/detail",name:"detail",component:detail,},
    {path:"/:lang/pres",name:"pres",component:pres,},    
    {path:"/:lang/presDeta/:projectId",name:"presDeta",component:presDeta,},
    {path:"/:lang/people",name:"people",component:people,},
    {path:"/:lang/process/:packageNumber",name:"process",component:process,},
    {path:"/:lang/cancel/:packageId",name:"cancel",component:cancel,},
    {path:"/:lang/modify/:packageId",name:"modify",component:modify,},
    {path:"/:lang/modifyTime/:pageNumber",name:"modifyTime",component:modifyTime,},
    {path:"/:lang/ment",name:"ment",component:ment,},
    {path:"/:lang/about",name:"about",component:about,},
    {path:"/:lang/addre",name:"addre",component:addre,},
    {path:"/:lang/aboutDate",name:"aboutDate",component:aboutDate,},
    {path:"/:lang/aboutTime",name:"aboutTime",component:aboutTime,},
    // {path:"/:lang/choose",name:"choose",component:choose,},
    // {path:"/:lang/personnel",name:"personnel",component:personnel,},
    {path:"/:lang/aboutDetail",name:"aboutDetail",component:aboutDetail,},
    {path:"/:lang/complete/:projectId",name:"complete",component:complete,},
    {path:"/:lang/record",name:"record",component:record,},   
    {path:"/:lang/report",name:"report",component:report,}, 
    {path:"/:lang/contact/:projectId/:id",name:"contact",component:contact,}, 
    {path:"/:lang/serviceRecord/:projectId",name:"serviceRecord",component:serviceRecord,}, 
    {path:"/:lang/presDetaWeb/:projectId",name:"presDetaWeb",component:presDetaWeb,},    
  ]
})
