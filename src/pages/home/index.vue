<template>
    <div id="home-wrap">  

        <div class="load-mask" v-loading="true" v-if="loading" element-loading-text="请稍等..."></div>
        
        <!-- 头部 -->
        <div id="header">
            <div id="title"><span @click="switchAsid" class="el-icon-menu" style="cursor:pointer"></span> {{title}}</div>
            <div id="right-form">
                <!-- 通知 -->
                <!-- <div class="notice iconfont icon-notice" @click="to('/home/message')" id="message-wrap">
                    <div class="num" v-if="messageCount">{{messageCount}}</div>
                </div> -->
                <!-- 用户头像 -->
                <div id="user-icon">
                    <img :src="headImg" alt="">
                </div>
                <!-- 下拉菜单 -->
                <el-dropdown @command="userIconCanmand">
                    <span class="el-dropdown-link" style="color:#fff;cursor:pointer;font-weight:900">
                        {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item command="changeProfile">资料修改</el-dropdown-item>
                        <el-dropdown-item command="changePass">修改密码</el-dropdown-item>
                        <el-dropdown-item command="changeLogin">登录方式</el-dropdown-item>
                        <el-dropdown-item command="setInvite">分成设置</el-dropdown-item>
                        <el-dropdown-item command="notifySetting">通知设置</el-dropdown-item> -->
                        <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <!-- 底部 -->
        <div id="content-wrap">

            <!-- aside导航 -->
            <div id="aside" :style="!isAsideOpen?'width:200px':'width:60px'">
                <el-menu :collapse="isAsideOpen" background-color="#324157" text-color="#fff" :collapse-transition="false" :router="true" :default-active="$route.path">
                    <el-menu-item index="/">
                        <i class="iconfont icon-dianpu"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-menu-item index="/productManage">
                        <i class="iconfont icon-ts-tubiao_production"></i>
                        <span slot="title">商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="/orderManage">
                        <i class="iconfont icon-baobiao"></i>
                        <span slot="title">订单管理</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <!-- 右侧内容区域 -->
            <div id="content">

                <!-- 内容顶部页面标签显示区域 -->
                <div id="top-content">
                    <navbar/>
                </div>

                <!-- 内容子页面显示区域，里边的页面抽成组件的形式 -->
                <div id="content-content">
                    <router-view/>
                </div>

            </div>
        </div>

    </div>
</template> 
<script>  
import navbar from "@components/navbar";
import storage from "@storage";
export default {
    components: {
        "navbar": navbar,
    },
    data() {
        return {
            title: ENV.TITLE,
            loading: !true,
            isAsideOpen: false,//控制aside导航是否展开
            headImg: "//admin.manduo.shop/Static/admin/images/user.png",
        }
    },
    mounted() {
        this.getUserInfo();
    },
    methods: {
        //左侧点击路由切换
        leftAsideTouch(path){
            this.$router.push({path: path});
        },
        getUserInfo(){
            // this.loading = true;
            // this.ajax.get("Supplier/User/status")
            // .then(({data})=>{
            //     this.loading = false;
            //     if(data.success){
            //         this.$store.commit("setUserInfo", {
            //             nickname: data.info && data.info.nickname || "",
            //             headImg: data.info && data.info.head_img || "",
            //         });
            //     }else{
            //         this.$message.error(data.message || "系统错误");
            //     }
            // })
            // .catch(err=>{
            //     this.loading = false;
            //     tools.ajaxErrHandler(this, err);
            // });
        },
        /*
        * 右上角用户展开菜单点击
        **/
        userIconCanmand: function(cmd){
            //退出登录
            if(cmd === "loginOut"){
                this.$confirm('确定退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    storage.del("TOKEN");
                    this.$router.replace({path: "/"});
                }).catch(() => {});
            }
            //修改密码
            if(cmd === "changePass"){
                this.$router.push({path: "/home/changePass"});
            }
            //登录方式
            if(cmd === "changeLogin"){
                this.$router.push({path: "/home/changeLogin"});
            }
            //修改资料
            if(cmd === "changeProfile"){
                this.$router.push({path: "/home/changeProfile"});
            }
            //分成设置
            if(cmd === "setInvite")
            {
                this.$router.push({path: "/home/setInvite"});
            }
            //通知设置
            if(cmd === "notifySetting")
            {
                this.$router.push({path: "/home/notifySetting"});
            }
        },

        //navbar下拉菜单事件处理
        navbarCommand: cmd=>{
            if(cmd === "offAll"){
                this.navbar.clearAll();
            }
            if(cmd === "offOther"){
                this.navbar.clearOther();
            }
        },

        /*
        * 左侧aside导航展开与关闭
        **/
        switchAsid: function(){
            this.isAsideOpen = !this.isAsideOpen;
        },


        //点击按钮路由跳转，（不用导航组件，样式重置啰嗦）
        to(path){
            this.$router.push(path);
        }
    },
    computed: {
        // nickname(){
        //     return this.$store.state.userInfo.nickname;
        // },
        // headImg(){
        //     return this.$store.state.userInfo.headImg;
        // },
        // messageCount() {
        //     return this.$store.state.messageCount > 99 ? "99+" : this.$store.state.messageCount;
        // },
        // //navbar展示数据
        // navbarContents () {
        //     return this.$store.state.navbar.contents;
        // }
    }
}
</script>
<style lang="less">
    @import "./index.less";
</style>