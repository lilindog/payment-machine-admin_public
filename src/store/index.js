import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

/**
 * 各个模块 
 */
import navbar from "./modules/navbar";

/**
 * 导出整个store 
 */
export default new Vuex.Store({
    modules: {
        navbar
    }
});
