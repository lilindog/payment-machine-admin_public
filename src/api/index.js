import request from "@tools/request";

/**
 * 验证码 
 */
export function getCaptcha () {
    return request({
        url: "/captcha"
    });
}

/**
 * 登录 
 */
 export function login (data = {
     token: "",
     name: "",
     pass: "",
     captcha: ""
 }) {
    return request({
        url: "/login",
        method: "POST",
        data
    });
}

/**
 * 获取首页展示数据
 */
 export function info () {
   return request({
       url: "/info"
   });
}