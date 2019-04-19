import Vue from 'vue'
export default {install(Vue,options){
	const constObj = {
		$toggleTab:"door",
		$text:"",
		$presTab:"all",
		$projectId: "",
		$supplierId: "",
		$path:"",
		$alipayBool: false,
		$gategory: "hellotoby-direct",
		$about:{
			address:{},
			area:{},
			situation:[],
			time:{},
			date:{},
			personnels:{},
			tional:[],
			note:{},
		},
		$isMobile:false,
		$whyQuestionNumber:"",
		$whyText:"",
		$date:{},
		$statusicon:{
			unpaid: false,
			inprocess: false,
			needReview: false
		},
		setAlipay: val => {
			Vue.prototype.$alipayBool = val;
		},
		setGategory: val => {
			Vue.prototype.$gategory = val;
		},
    settoggleTab: val=>{
			Vue.prototype.$toggleTab = val;
		},
		setText:val=>{
			Vue.prototype.$text = val;
		},
		setPresTab:val=>{
			Vue.prototype.$presTab = val;
		},
		setAbout:(key,val)=>{
			Vue.prototype.$about[key] = val;
		},
		setAboutAll:(val)=>{
			Vue.prototype.$about = val;
		},
		setProjectId: val=>{
			Vue.prototype.$projectId = val;
		},
		setSupplierId: val => {
			Vue.prototype.$supplierId = val;
		},
		setPath:(val)=>{
			Vue.prototype.$path = val;			
		},
		setStatusicon: (key,val) => {
			Vue.prototype.$statusicon[key] = val;
		},
		setWhy:(val)=>{
			Vue.prototype.$why = val;						
		},
		setWhyQuestionNumber:(val)=>{
			Vue.prototype.$whyQuestionNumber = val;						
		},
		setWhyText:(val)=>{
			Vue.prototype.$whyText = val;			
		},
		setDate:(val)=>{
			Vue.prototype.$date = val;			
		},
		setIsMobile:(val)=>{
			Vue.prototype.$isMobile = val;			
		},
		gaGoogle:(path)=>{
			gtag('config', 'UA-55292513-9',  { page_path:path });
		},
	};
	Object.assign(Vue.prototype,constObj);
}}
