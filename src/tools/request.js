import axios from 'axios';
import storage from "@storage/index";
import router from "../router/index";
import { Message } from "element-ui";
import NProgress from "nprogress";

// 创建axios实例
const request = axios.create({
	baseURL: ENV.HOST + "/admin",
	timeout: ENV.REQUEST.timeout
})

// request拦截器
request.interceptors.request.use(
	config => {
		NProgress.start();
		const TOKEN = storage.get("TOKEN");
		config.headers["Authorization"] = TOKEN ?? "";
		return config;
	}, 
	error => {
		NProgress.done();
		Message.error(ENV.REQUEST.msg_neterr);
		console.error(error);
	}
);

// respone拦截器
request.interceptors.response.use(
	({ data: res }) => {
		NProgress.done();
		if (!res.success) {
			if (res.status === 403) {
				storage.del("TOKEN");
				router.replace({ path: "/login" });
			}
			Message.error(res.message || ENV.REQUEST.msg_syserr);
		} else {
			return res;
		}
	},
	() => {
		NProgress.done();
		Message.error(ENV.REQUEST.msg_neterr);
	}
);

export default request;