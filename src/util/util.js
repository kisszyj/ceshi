

// var baseUrl = "http://alipaytest.hellotoby.com/";//测试服
// var baseUrl = "https://api.hellotoby.com";//正式服

let baseUrl  = process.env.API_HOST;
let cmsUrl = process.env.CMS_HOST;
if(baseUrl === "undefined"){
	baseUrl = "http://alipaytest.hellotoby.com/";
}

if(cmsUrl === "undefined"){
	cmsUrl = 'http://test.hellotoby.com/';
}


// import Ajax from './ajax'
import Request from './request'

const Ajax = (params, bool) => {
	var loading = String(params.loading) == "undefined" ?true:params.loading;
	if(loading){
		myApp.$root.eventHub.$emit('loading', true)
	}
	var urlstr = "";
	if(bool){
		urlstr = cmsUrl + params.url
	}else{
		urlstr = baseUrl + params.url
	}

	if(params.uploadfile){
		var defaults = {
			url: urlstr,
			type: params.type ? params.type : "post",
			dataType:params.dataType? params.dataType:"json",			
			contentType:params.contentType?params.contentType:"application/x-www-form-urlencoded",
		}
	}else{
		var defaults = {
			url: urlstr,
			dataType:params.dataType? params.dataType:"json",
			contentType:params.contentType?params.contentType:"application/x-www-form-urlencoded",
			type: params.type ? params.type : "post",
			async: String(params.async) ? params.async : true,
		};
		if(params.type === "post"){
			params.data = JSON.stringify(params.data);
			defaults.dataType = "json";
			defaults.contentType = "application/json;charset=UTF-8";
		}
		
	}



	for(var key in defaults) {
		params[key] = defaults[key];
	}
	var _successFn = params.success;
	var _error = params.error;
	params.beforeSend = function(req) {
	}
	params.success = function(result, status, xhr) {
		if(loading){
			myApp.$root.eventHub.$emit('loading', false);					
		}
		if(result.success) {
			_successFn(result, status, xhr)
		} else {
			if(_error){
				_error(result);		
			}else{
				myApp.$root.eventHub.$emit("showprompt",{
					content:result.errorMessage,
				});
			}
		}
	}
	params.error = function(err) {
		if(loading){
			myApp.$root.eventHub.$emit('loading', false);					
		}
		myApp.$root.eventHub.$emit("showprompt",{
			content:err,
		});
	}
	Request(params)
}

export const ajax = Ajax;

export const dateFormat = (tmp, fmt) => {
	var date = null;
	if(!tmp) {
		return "";
	}
	if(tmp instanceof Date) {
		date = tmp;
	} else if(typeof tmp == "string" || typeof tmp == "number") {
		date = new Date(tmp);
	} else {
		return "";
	}
	if(date == "Invalid Date") {
		var aaa = tmp.replace(/-/g, "/");
		date = new Date(aaa);
	}
	if(!fmt) {
		fmt = "yyyy-MM-dd";
	}
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
	  // 'yyyy-MM-dd hh:mm:ss'
	  //'yyyy年MM月dd日'

}

//设置cookie
export const setCookie = (cname, cvalue, exdays) => {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=.hellotoby.com;path=/";
  }
  //获取cookie
export const  getCookie = (cname) => {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') c = c.substring(1);
	  if (c.indexOf(name) != -1){
		return c.substring(name.length, c.length);
	  }
	}
	return "";
  }
  //清除cookie
export const  clearCookie = () =>{
	this.setCookie("username", "", -1);
}

// 遍历questions请求数据
export const  getQuestionsAll = (question,num) =>{
	let questions = question?question:[];
	let datas = {
		questions:[],
	}
	if(typeof num === "number"){
		datas.pageNum = num
	}else{
		datas.packageNumber = num
	}
	for(let i=0; i<questions.length; i++){
		if(questions[i].type === "ENUMERATION"){
			let arry = {
				questionNumber:questions[i].questionNumber,
				shortLabel:questions[i].shortLabel,
				type:questions[i].type,
				answers:[],
			}
			for(let j=0; j<questions[i].possibleValues.length; j++){
				if(questions[i].possibleValues[j].start){		
					if(questions[i].possibleValues[j].canDescribe){
						arry.answers.push({value:questions[i].possibleValues[j].value,label:questions[i].possibleValues[j].label,other:questions[i].possibleValues[j].other});
					}else{
						arry.answers.push({value:questions[i].possibleValues[j].value,label:questions[i].possibleValues[j].label});					
					}
				}
			}
			datas.questions.push(arry);
		}
		if(questions[i].type === "NUMBER"){
			let arry = {
				questionNumber:questions[i].questionNumber,
				shortLabel:questions[i].shortLabel,
				type:questions[i].type,
				answers:[{
					value:questions[i].initValue,
				}]
			}
			datas.questions.push(arry);	
		}
		if(questions[i].type === "DATETIME"){
			console.log(questions[i])
			let arry = {
				questionNumber:questions[i].questionNumber,
				shortLabel:questions[i].shortLabel,
				type:questions[i].type,
				answers:[{
					value:questions[i].dates.day + " "+ questions[i].dates.startTime,
				}]
			}
			datas.questions.push(arry);	
		}
		if(questions[i].type === "ADDRESS"){
			let arry = {
				questionNumber:questions[i].questionNumber,
				shortLabel:questions[i].shortLabel,
				type:questions[i].type,
				answers:[{
					value:questions[i].id,
					label:questions[i].address
				}]
			}
			datas.questions.push(arry);
		}
		if(questions[i].type === "TEXT"){
			let arry = {
				questionNumber:questions[i].questionNumber,
				shortLabel:questions[i].shortLabel,
				type:questions[i].type,
				answers:[{
					value:questions[i].value,
				}]
			}
			datas.questions.push(arry);
		}
	}

	return datas;

}
// 单独获取questions请求数据
export const  getQuestionsItem = (question,num,key) =>{
	let questions = question?question:[];

	let datas = {
		pageNum:num,
		questions:[],
	}

	for(let i=0; i<questions.length; i++){
		if(questions[i].type === "NUMBER"){
			let arry = {
				questionNumber:questions[i].questionNumber,
				answers:[{
					value:questions[i].initValue
				}]
			}
			datas.questions.push(arry);	
		}
	}

	// if(JSON.stringify(data[key]) != "{}"){
	// 	var arry = {
	// 		questionNumber:data[key].questionNumber,
	// 		answers:[{
	// 			value:data[key].initValue?data[key].initValue:data[key].answers[0].value,
	// 		}]
	// 	}
	// 	datas.questions.push(arry);		
	// }
	return datas;
}
// 获取Monday
export const getMonday = (time,start) => {
	const dayList = myApp.$t("message.dayList");	
	const str = time.replace(/-/g, '/');
	const date = new Date(str).getTime();
	if(start){
		const today = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
		const tomorrow = new Date(new Date(new Date().toLocaleDateString()).getTime()+48*60*60*1000-1);
		if(today > date){
			return dayList[7];
		}else if(tomorrow > date){
			return dayList[8];
		}else{
			const day = new Date(str).getDay();	
			return dayList[day];		
		}
	}else{
		const day = new Date(str).getDay();	
		return dayList[day];
	}
	
}

export const getEndate = (item,start) => {
	let monthArr = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
	let suffix = new Array("st","nd","rd","th");
	let arr = item.split("-");
	let year = parseInt(arr[0]);
	let month = monthArr[parseInt(arr[1])-1];
	let dday = parseInt(arr[2]);
	if(dday % 10 < 1 || dday % 10 >3){
		dday = dday + suffix[3];
	}else if(dday % 10 == 1){
		dday = dday + suffix[0];
	}else if(dday % 10 == 2){
		dday = dday + suffix[1];
	}else{
		dday = dday + suffix[2];
	}
	if(start){
		return dday + " " + month + " " + year;
	}else{
		return dday + " " + month;
	}
}

 export const  getUrlVars = () => {
	var vars = [],
		hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = (hash[1]&&hash[1].indexOf('#')>-1)?hash[1].substring(0,hash[1].indexOf('#')):hash[1];
	}
	return vars;
}

export const setQuestions= ( obj, num ) => {
	if(num){
		obj.pageNum = num;
	}
	let questions = (getVal("questions") && getVal("questions").length > 0)?getVal("questions"):[];
	if(questions.length){
		for(let i=0; i<questions.length; i++){
			if(questions[i].questionNumber === obj.questionNumber){
				questions.splice(i,1,obj);
				break;
			}else if(i+1 >= questions.length){
				questions.push(obj)
			}
		}
	}else{
		questions.push(obj);
	}
	let value = JSON.stringify(questions);
	if(value === "" || value === "{}" || value === "[]" || !value ){
		value = "";
	}
	sessionStorage.setItem("questions", value);
}

const getVal = (name) => {
	var value = null;
	var vars = sessionStorage.getItem(name);
	if(vars !== "" && vars){
		value = JSON.parse(vars);
	}else{
		value = vars;
	}
	return value;
}

export const getQuestions = () => {
	return getVal("questions");
}

export const getSession = (name) => {
	return getVal(name);
}

export const setSession = (name, obj) => {
	var value = JSON.stringify(obj);
	if(value === "" || value === "{}" || value === "[]" || !value ){
		value = "";
	}
	sessionStorage.setItem(name, value);
}

export const clearQuestionItem = (type) => {
	let questions = getVal("questions")?getVal("questions"):[];
	if(questions.length){
		for(let i=0; i<questions.length; i++){
			if(questions[i].type === type){
				questions.splice(i,1);
				break;
			}
		}
		let value = JSON.stringify(questions);
		sessionStorage.setItem("questions", value);
	}
}

export const clearQuestionNumber = (questionNumber) => {
	let questions = getVal("questions")?getVal("questions"):[];
	if(questions.length){
		for(let i=0; i<questions.length; i++){
			if(questions[i].questionNumber === questionNumber){
				questions.splice(i,1);
				break;
			}
		}
		let value = JSON.stringify(questions);
		sessionStorage.setItem("questions", value);
	}
}

export const clearQuestions = () =>{
	sessionStorage.removeItem("questions");
}

export const PackageId = (_this) => {
	const packageId = getVal("packageId")
	_this.setPath(packageId);
}

//支付
export const  payAlipay = (data) => {
	const { alipayBool, billId, api , projectId , locale , errorMessage } = data;
	if(alipayBool){
		const params = {
				url:`api/alipayhk/bill/${billId}/orderString`,
				type:"get",
				success:res=>{
						if(res.data){
							AlipayJSBridge.call('tradePay',{
								orderStr: res.data 
							}, function(result){
								if(result.resultCode === "9000"){
									const url = encodeURI(window.location.href.replace(window.location.hash,''));
									const href = `${url}#/${locale}/presDeta/${projectId}`;
    							window.location.href =href;
								}else{
									myApp.$root.eventHub.$emit("showprompt",{
										content:errorMessage,
									});
								}
								// alert(JSON.stringify(result));
							});
						}
				}
		}
		Ajax(params)
	}else{
		let href = api+'api/alipayhk/bill/'+ billId +'/pay'
    // window.location.href =href;
	}
}