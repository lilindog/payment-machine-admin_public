<template>
    <PageWrap title="首页" icon="icon-shouye1">
        <!-- <h1>后台简要信息</h1> -->
        <div class="info-box">
            <div class="in">
                <div class="num">{{orderCount}}</div>
                <div class="summary">订单总数</div> 
            </div>
        </div>
        <div class="info-box">
            <div class="in">
                <div class="num">{{totalAmount}}</div>
                <div class="summary">总成交金额</div> 
            </div>
        </div>
        <div class="info-box">
            <div class="in">
                <div class="num">{{totalProduct}}</div>
                <div class="summary">商品总数</div> 
            </div>
        </div>
        <div class="info-box">
            <div class="in">
                <div class="num">{{unpaidOrderCount}}</div>
                <div class="summary">未支付订单总数</div> 
            </div>
        </div>
    </PageWrap>
</template>
<style lang="less" scoped>
@import "./index.less";
</style>
<script>
import { info } from "@api/index";
import PageWrap from "@components/pagewrap";
export default {
    components: {
        PageWrap
    },
    data(){
        return {
            // 订单总数
            orderCount: 0,
            // 总成交金额
            totalAmount: 0,
            // 总商品数量
            totalProduct: 0,
            // 未支付订单数量
            unpaidOrderCount: 0,
        }
    },
    mounted () {
        this.loadInfo();
    },
    methods:{
        async loadInfo () {
            const res = await info();
            if (res && res.data) {
                this.orderCount = res.data.orderCount;
                this.totalAmount = res.data.totalAmount;
                this.totalProduct = res.data.totalProduct;
                this.unpaidOrderCount = res.data.unpaidOrderCount;
            }
        }
    }
}
</script>

