<template>
    <!-- login页面 -->
    <div id="login-wrap">
        <form class="login-box" v-loading="isLoading"  :element-loading-text="loadText">
        
            <div>
                <div class="title">
                    {{title}}
                </div>
                <form action="">
                    <div class="input-row">
                        <el-input placeholder="账户" v-model="name">
                            <template slot="prepend"><span class="iconfont icon-touxiang"></span></template>
                        </el-input>
                    </div>
                    <div class="input-row">
                        <el-input placeholder="密码" type="password" v-model="pass" @keyup.enter.native="login">
                            <template slot="prepend"><span class="iconfont icon-mima"></span></template>
                        </el-input>
                    </div>
                    <div class="input-row input-row__captcha">
                        <div class="left">
                            <img class="captcha-img" :src="captchaSrc" @click="refreshCapctah" alt="验证码"/>
                        </div>
                        <div class="right">
                            <el-input placeholder="验证码" v-model="captcha" @keyup.enter.native="login"/>
                        </div>
                    </div>
                    <div class="input-row">
                        <el-button type="primary" style="width:100%;" @click="onLogin">登录</el-button>
                    </div>
                </form>
            </div>

        </form>
    </div>
    
</template>
<style lang="less" scoped>
    @import "./index.less";
</style>
<script>
import storage from "@storage/index";
import { getCaptcha, login } from "@api/index";

export default {
    data(){
        return {
            title: ENV.TITLE,
            name: "",
            pass: "",
            captcha: "",
            captchaSrc: "",//验证码地址
            isLoading: false,//是否打开加载动画
            loadText: "正在登录...",
            token: "",
        }
    },
    mounted () {
        this.title = ENV.TITLE;
        //初始化验证码地址
        this.refreshCapctah();   
    },
    methods: {

        async refreshCapctah () {
            const { data: { token, img } } = await getCaptcha();
            this.captchaSrc = img;
            this.token = token;
        },

        async onLogin () {
            const data = {};
            for (let k of ["name", "pass", "captcha"]) {
                if (!this[k]) return this.$message.warning(({
                    name: "账户", pass: "密码", captcha: "验证码"
                })[k] + "没有填写");
                data[k] = this[k];
            }
            data.token = this.token;
            this.isLoading = true;
            try {
                var { success, data: { token } } = await login(data);
            } catch(err) {
                return this.isLoading = false;    
            }
            this.isLoading = false;
            if (token) {
                storage.set("TOKEN", token);
                this.$message.success("登陆成功");
                this.$router.push({ path: "/" });
            }
        }
    }
}
</script>