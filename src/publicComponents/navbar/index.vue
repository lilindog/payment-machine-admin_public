<template>
    <div id="top-banner">
        <div id="top-banner-content">

            <!-- 每个打开的页面标签 -->
            <div :class="item.active ? 'top-banner-child active':'top-banner-child'" v-for="(item, index) in navbarContents" :key="index" @click="touch(index)">
                <div id="top-banner-child-left">{{item.title}}</div>
                <div id="top-banner-child-right" class="el-icon-close" @click.stop="off(index)"></div>
            </div>

        </div>
        <div id="top-banner-right">
            <el-dropdown @command="navbarCommand">
                <div id="content-top-banner-btn">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="offOther">关闭其它</el-dropdown-item>
                    <el-dropdown-item command="offAll">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import "./index.less";
</style>
<script>
export default {
    computed: {
        //存储在全局store navbar中的tag集合
        navbarContents () {
            return this.$store.state.navbar.tags;
        }
    },
    data () {
        return {
        }
    },
    mounted () {

    },
    methods: {
        //点击
        touch (index) {
            const tag = this.navbarContents[index];
            if (this.$route.path === tag.path) return;
            this.$router.push({path: tag.path});
            this.$store.commit("navbar/CHANGE_TAG", tag);
        },
        //关闭标签
        off (index) {
            const tag = this.navbarContents[index];
            if (tag.active) {
                const navbarLen = this.navbarContents.length;
                //当前激活页面为navbar唯一的页面时，关闭后打开首页
                if (navbarLen === 1) {
                    //当前激活页面为首页时，不做动作
                    if (tag.path === "/home") {
                        return;
                    }
                    this.$store.commit("navbar/REMOVE_TAG", index);
                    this.$router.replace({path: "/home"});
                } 
                //当前激活页面不是navbar惟一的页面， 则关闭当前页面跳转到前一个页面
                else {
                    //激活页为第一位时候，关闭后打开后面的页面
                    if (index === 0) {
                        const nextTag = this.navbarContents[1];
                        this.$store.commit("navbar/REMOVE_TAG", index);
                        this.$router.replace({path: nextTag.path});
                    } 
                    //否则打开前一个页面
                    else {
                        const lastPrevTag = this.navbarContents[index - 1];
                        this.$store.commit("navbar/REMOVE_TAG", index);
                        this.$router.replace({path: lastPrevTag.path});
                    }
                }
            } else {
                this.$store.commit("navbar/REMOVE_TAG", index);
            }
        },
        //关闭菜单点击
        navbarCommand (cmd) {
            if (cmd === "offAll") {
                this.$store.commit("navbar/CLEAR_NAVBAR");
                this.$router.replace({path: "/home"});
            }
            if (cmd === "offOther") {
                this.$store.commit("navbar/REMOVE_OTHER_TAG");
            }
        }
    }
}
</script>