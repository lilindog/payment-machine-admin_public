/**
 * 内页路由 
 */

import page404 from "@pages/404";                              
import info from "@views/info";                    
import productManage from "@views/productManage";
import orderManage from "@views/orderManage";

export default [
    {
        path: "/",
        component: info,
        meta: {
            title: "首页"
        }
    },
    {
        path: "/productManage",
        component: productManage,
        meta: {
            title: "订单管理"
        }
    },
    {
        path: "/orderManage",
        component: orderManage,
        meta: {
            title: "订单管理"
        }
    },
    {
        path: "*",
        component: page404,
        meta: {
            title: "404"
        }
    }
]