<template>
    <PageWrap title="订单管理" icon="icon-baobiao">
        <el-form :inline="true">
            <el-form-item label="订单状态">
                <el-select v-model="status" @change="onStatusChange" placeholder="请选择">
                    <el-option
                    v-for="item in statusMap"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="搜索订单号" v-model="orderNumber"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" @click="onSearch">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
        :data="list"
        style="width: 100%"
        >
            <el-table-column
            width="100"
            prop="id"
            label="id"
            />
            <el-table-column
            width="200"
            prop="order_number"
            label="订单号"
            />
            <el-table-column
            label="订单状态"
            >
                <div slot-scope="scope">
                    <el-tag v-if="scope.row.status === 1" type="success">{{onStatus(scope.row.status)}}</el-tag>
                    <el-tag v-else-if="scope.row.status === 0">{{onStatus(scope.row.status)}}</el-tag>
                    <el-tag type="info" v-else>{{onStatus(scope.row.status)}}</el-tag>
                </div>
            </el-table-column>
            <el-table-column
            label="订单金额（元）"
            >
                <p style="color: red" slot-scope="scope">{{scope.row.pay_amount}}</p>
            </el-table-column>
            <el-table-column
            width="200"
            label="创建时间"
            >
                <p slot-scope="scope">{{onDate(scope.row.create_date)}}</p>
            </el-table-column>
            <el-table-column
            width="200"
            label="支付时间"
            >
                <p slot-scope="scope">{{scope.row.pay_date ? onDate(scope.row.pay_date) : "-"}}</p>
            </el-table-column>
            <el-table-column
            label="支付日志"
            >
                <el-button  slot-scope="scope" type="text" @click="togglePaylist(scope.row)">支付日志</el-button>
            </el-table-column>
            <el-table-column
            label="退款日志"
            >
                <template slot-scope="scope">
                    <!-- 已支付和手动取消才显示退款日志查询按钮 -->
                    <el-button v-if="scope.row.status == 1 || scope.row.status == 3" type="text" @click="toggleRefundList(scope.row)">退款日志</el-button>
                    <p v-else>-</p>
                </template>
            </el-table-column>
            <el-table-column
            label="商品详情"
            >
                <el-button type="text" slot-scope="scope" @click="toggleOrderDetail(scope.row)">商品详情</el-button>
            </el-table-column>
            <el-table-column
            label="操作"
            width="250px"
            >
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 1" type="primary" @click="onRefund(scope.row)">退款</el-button>
                    <p v-else>-</p>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
        style="margin-top: 16px;"
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-count="totalPage"
        @current-change="onPageChange"
        />

        <!-- 订单支付发起记录 -->
        <el-dialog
        :title="productPaylist.title"
        :visible="productPaylist.show"
        @close="togglePaylist(false)"
        width="60%"
        >
            <el-table
            :data="productPaylist.list"
            height="700"
            >
                <el-table-column
                label="序号"
                >
                    <p slot-scope="scope">{{scope.$index + 1}}</p>
                </el-table-column>
                <el-table-column
                label="发起时间"
                >
                    <p slot-scope="scope">{{scope.row.create_date ? onDate(scope.row.create_date) : "-"}}</p>
                </el-table-column>
                <el-table-column
                prop="pay_number"
                label="支付编号"
                />
                <el-table-column
                prop="msg"
                label="详情"
                />
            </el-table>
        </el-dialog>

        <!-- 订单退款日志记录 -->
        <el-dialog
        :title="refundList.title"
        :visible="refundList.show"
        @close="toggleRefundList(false)"
        width="60%"
        >
            <el-table
            :data="refundList.list"
            height="700"
            >
                <el-table-column
                label="序号"
                >
                    <p slot-scope="scope">{{scope.$index + 1}}</p>
                </el-table-column>
                <el-table-column
                label="发起时间"
                >
                    <p slot-scope="scope">{{scope.row.create_date ? onDate(scope.row.create_date) : "-"}}</p>
                </el-table-column>
                <el-table-column
                prop="msg"
                label="详情"
                />
            </el-table>
        </el-dialog>

        <!-- 订单商品详情 -->
        <el-dialog
        :title="productDetail.title"
        :visible="productDetail.show"
        @close="toggleOrderDetail(false)"
        width="50%"
        >
            <el-table
            :data="productDetail.list"
            height="700"
            >
                <el-table-column
                prop="title"
                label="产品标题"
                />
                <el-table-column
                label="产品图片"
                >
                    <img style="height: 100px; width: 100px" slot-scope="scope" :src="HOST + '/' + scope.row.img" alt="商品图片">
                </el-table-column>
                <el-table-column
                prop="count"
                label="购买数量"
                />
                <el-table-column
                prop="pay_amount"
                label="结算价格（元）"
                />
            </el-table>
        </el-dialog>

    </PageWrap>
</template>
<style lang="less" scoped>
@import "./index.less";
</style>
<script>
import { queryOrders, getPaylog, refund, getRefundLog } from "@api/order";
import tools from "@tools/tools";
import PageWrap from "@components/pagewrap";

export default {
    components: {
        PageWrap
    },
    data(){
        return {
            HOST: ENV.HOST + "/static",
            list: [],
            statusMap: [
                { value: "", label: "全部" },
                { value: 0, label: "未支付" },
                { value: 1, label: "已支付" },
                { value: 2, label: "手动完成" },
                { value: 3, label: "手动取消" }
            ],
            status: "",
            orderNumber: "",
            page: 1,
            limit: 10,
            totalPage: 1,
            productDetail: {
                show: false,
                title: "",
                list: []
            },
            productPaylist: {
                show: false,
                title: "",
                list: []
            },
            refundList: {
                show: false,
                title: "",
                list: []
            }
        }
    },
    mounted () {
        this.loadOrders();
    },
    methods:{
        async togglePaylist (item) {
            const _ = this.productPaylist;
            if (item) {
                _.show = true;
                _.title = item.order_number + " 支付日志记录";
                const res = await getPaylog({ orderNumber: item.order_number });
                if (res && res.data) _.list = res.data;
            }
            else {
                _.show = false;
                _.title = "";
                _.list = [];
            }
        },
        async toggleRefundList (row) {
            const _ = this.refundList;
            if (row) {
                _.show = true;
                _.title = row.order_number + " 退款日志记录";
                const res = await getRefundLog({ orderNumber: row.order_number });
                if (res && res.data) _.list = res.data;
            }
            else {
                _.show = false;
                _.title = "";
                _.list = [];
            }
        },
        toggleOrderDetail (item) {
            const _ = this.productDetail;
            if (item) {
                _.show = true;
                _.title = item.order_number + " 订单购买商品";
                _.list = item.products;
            }
            else {
                _.show = false;
                _.list = [];
                _.title = "";
            }
        },
        onStatus (status) {
            return this.statusMap.find(i => i.value === status).label;
        },
        onDate (str) {
            return tools.getDate(str);
        },
        async loadOrders () {
            const params = {
                page: this.page,
                limit: this.limit,
                status: this.status,
                orderNumber: this.orderNumber
            };
            const { data: { list, totalPage } } = await queryOrders(params);
            this.totalPage = totalPage;
            this.list = list;
        },
        onStatusChange () {
            this.page = 1;
            this.loadOrders();
        },
        onSearch () {
            this.page = 1;
            this.loadOrders();
        },
        onPageChange (page) {
            this.page = page;
            this.loadOrders();
        },
        onRefund (row) {
            this.$confirm(`确定退款(此操作不可逆)？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await refund({ orderNumber: row.order_number });
                if (res && res.success) {
                    this.loadOrders();
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        let str = res.data.reduce((t, c) => {
                            c += c.title + ",";
                            return t;
                        }, "");
                         this.$alert(str.slice(0, -1) + "已经删除，无法释放库存。", '退款成功', {
                            confirmButtonText: '确定',
                            callback: () => { }
                        });
                    } else {
                        this.$message.success(`退款成功`);
                    }
                }
            }).catch(() => {});
        }
    }
}
</script>

