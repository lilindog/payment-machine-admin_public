/*
*
* 使用webpack单页面遇到import引入问题，故改之。
* created by lilin on 2018/10/10
*
**/ 

/*
* 改用es6模块导出语法实现
**/
class wxLogin{
    constructor(obj){
        let c = "default";
        if(obj.self_redirect === true){
            c = "true";
        }
        if(obj.self_redirect === false){
            c = "false";
        }
        let 
        iframe = document.createElement("iframe"),
        url = "https://open.weixin.qq.com/connect/qrconnect?appid="+obj.appid+"&scope="+obj.scope+"&redirect_uri="+obj.redirect_uri+"&state="+obj.state+"&login_type=jssdk&self_redirect="+c;

        url += obj.style?"&style="+obj.style:"";
        url += obj.href?"&href="+obj.href:"";
        iframe.src = url;
        iframe.frameBorder = "0";
        iframe.allowTransparency="true";
        iframe.scrolling="no";
        iframe.width="300px";
        iframe.height="300px";
        
        const wrap = document.getElementById(obj.id);
        wrap.innerHTML="";
        wrap.appendChild(iframe);
    }
}
export default wxLogin;



/* 这是原来的代码，微信压缩了的，仅支持script标签引入

!function(a,b,c){
    function d(a){
        var c="default";
        a.self_redirect===!0?c="true":a.self_redirect===!1&&(c="false");
        var d=b.createElement("iframe"),e="https://open.weixin.qq.com/connect/qrconnect?appid="+a.appid+"&scope="+a.scope+"&redirect_uri="+a.redirect_uri+"&state="+a.state+"&login_type=jssdk&self_redirect="+c;
        e+=a.style?"&style="+a.style:"",e+=a.href?"&href="+a.href:"",d.src=e,d.frameBorder="0",d.allowTransparency="true",d.scrolling="no",d.width="300px",d.height="400px";
        var f=b.getElementById(a.id);
        f.innerHTML="",
        f.appendChild(d)
    }
    a.WxLogin=d
}(window,document);
*/