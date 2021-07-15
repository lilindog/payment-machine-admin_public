/**
 * navbar 全局数据状态 
 */

 export default {
    namespaced: true,
    state: {
        tags: [
            //内部元素结构请参见tools.buildTagsChild()方法返回值
        ]
    },
    mutations: {
        //设置navbar
        SET_NAVBAR (state, tags) {
            const MAX = 10;//限制最多10个标签
            if (tags.length > MAX) {
                const activeTag = tags.find(item => item.active);
                tags = tags.slice(tags.length - (MAX - 1));
                tags.push(tags);
            }
            state.tags = tags;
        },
        //切换标签
        CHANGE_TAG (state, tag = {}) {
            const tags = state.tags;
            const has = tags.find(item => item.title === tag.title && item.path === tag.path);
            if (has.active) return;
            if (has) {
                tags.forEach(item => item.active = false);
                has.active = true;
                state.tags = tags;
            }
        },
        //清空navbar
        CLEAR_NAVBAR (state) {
            state.tags = [];
        },
        //删除指定标签
        REMOVE_TAG (state, index) {
            state.tags.splice(index, 1);
            state = state;
        },
        //删除非当前路由标签
        REMOVE_OTHER_TAG (state) {
            const tags = state.tags;
            const newTags = tags.filter(item => item.active);
            state.tags = newTags;
        }
    }
 }