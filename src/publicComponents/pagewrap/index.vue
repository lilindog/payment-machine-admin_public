<template>
    <div class="wrap">
        
        <!-- 面包屑标题 -->
        <div class="title"><span :class="'title-icon iconfont ' + icon"></span> {{title}}</div>

        <!-- 内容 -->
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "未指定title"
        },
        icon: {
            type: String,
            default: ""
        }
    }    
}
</script>
<style lang="less" scoped>
</style>