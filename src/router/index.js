import Vue from "vue";
import vueRouter from "vue-router";

const routerPush = vueRouter.prototype.push;
const routerReplace = vueRouter.prototype.replace;
vueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}
vueRouter.prototype.replace = function (to) {
    routerReplace.call(this, to).catch(err => err);
}
Vue.use(vueRouter);

import routingGuard from "./routingGuard";
import login from "@pages/login";      
import home from "@pages/home";        
import page404 from "@pages/404";       
import innerRoutes from "./innerRoutes"; 
const router = new vueRouter({
    mode: "hash",
    routes: [
        {
            path:"/login",
            component: login,
            meta: {
                title: ENV.title
            }
        },
        {
            path: "/",
            component: home,
            children: innerRoutes
        },
        {
            path: "*",
            component: page404,
            meta: {
                title: ENV.title
            }
        }
    ]
});

//使用路由守卫
routingGuard(router);

export default router;