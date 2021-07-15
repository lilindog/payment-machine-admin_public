import NProgress from "nprogress";
import "nprogress/nprogress.css";
import App from './app.vue';
import "./static/less/reset.less";
import router from "./router";
import store from "./store";

NProgress.configure({
	parent: "#progress",
	template: `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"></div>'`
});
Vue.config.silent = true//取消日志和警告
new Vue({
    el: "#app",
    render(createEelment){
        return createEelment(App);
    },
    router,
    store
});