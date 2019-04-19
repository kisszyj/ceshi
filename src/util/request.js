// 引用superagent
let request = require('superagent')
function apiBase (obj) {
  let r = request(obj.type, obj.url).accept(obj.dataType).set("Access-Control-Allow-Origin","*").withCredentials()
  if(obj.uploadfile){
    r.field('mediaCategory',"CST");
    r.attach('mediaFile', obj.data);
  }else{
    r.type(obj.contentType)
  }
  
  //设置超时时间
  let timeout = obj.timeout || 15000;
  r.timeout({deadline:timeout})

  if (obj.type === 'post' && !obj.uploadfile) {
    const data = obj.uploadfile?obj.data:JSON.parse(obj.data);
    r = r.send(data)
  } else if (obj.type === 'get') {
    r = r.query(obj.data)
  }
  r.end(function (err, res) {
    if (err) {
      if(err.timeout){
        obj.error('请求超时! ')
      }else{
        obj.error(res.status)
      }
      return
    };
    obj.success(res.body)
  })
};

export default apiBase;