/**
 * 全局路由守卫
 * 
 * 页面鉴权拦截，页面标题切换显示都在这里处理 
 */

import tools from "../tools/tools";
import store from "../store";
import storage from "../tools/storage";
// import router from "../router/index";
import { Message } from "element-ui";

export default function routingGuard (router = {}) {

    router.beforeEach((to, from, next) => {
        auth(to, next); 
        setTitle(to);
        setNavbar(to);
    });

    //auth
    function auth (to, next = () => {}) {
        next();
        if (to.path === "/login") {
            if (storage.get("TOKEN")) {
                try { router.replace({path: "/"}); } catch(err) {}
            } else {
                next();
            }
        } else {
            if (!storage.get("TOKEN")) {
                Message.error("清先登录");
                try { router.replace({path: "/login"}); } catch(err) {}
            } else {
                next();
            }
        }
    }

    //设置标题
    function setTitle (to = {}) {
        document.title = to.meta.title || "";
    }

    //设置navbar
    function setNavbar (to = {}) {
        if (!to.meta.title) return;
        const tags = store.state.navbar.tags || [];
        const has = tags.find(item => item.title === to.meta.title && item.path === to.path);
        tags.forEach(item => item.active = false);
        if (has) {
            has.active = true;
        }
        else {  
            let tag = tools.buildTagsChild();
            tag.active = true;
            tag.title = to.meta.title;
            tag.path = to.path;
            tags.push(tag);
        }
        store.commit("navbar/SET_NAVBAR", tags);
    }

}