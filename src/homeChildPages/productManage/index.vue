<template>
    <PageWrap title="商品管理" icon="icon-ts-tubiao_production">

        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="keyword" placeholder="商品名搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="loadProducts">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-plus" @click="toggleProductToast(true)">商品入库</el-button>
            </el-form-item>
        </el-form>
        <el-table
        :data="list"
        style="width: 100%"
        >
            <el-table-column
            prop="id"
            label="id"
            />
            <el-table-column
            prop="code"
            label="商品条码"
            />
            <el-table-column
            prop="title"
            label="标题"
            />
            <el-table-column
            label="图片"
            >
                <img style="height: 100px; width: 100px;" slot-scope="scope" :src="HOST + '/' + scope.row.img" alt="商品图片">
            </el-table-column>
            <el-table-column
            prop="amount"
            label="商品价格(元)"
            />
            <el-table-column
            prop="stock"
            label="库存(个)"
            />
            <el-table-column
            label="操作"
            width="250px"
            >
                <template slot-scope="scope">
                    <el-button type="primary" @click="toggleProductToast(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="onRemoveProduct(scope.row)">删除商品</el-button> 
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

        <!-- 新增（入库）商品弹窗 -->
        <el-dialog
        :title="productToast.title"
        :visible="productToast.show"
        :show-close="false"
        width="30%"
        >
            <el-form>
                <el-form-item label="商品标题">
                    <el-input v-model="productToast.form.title" placeholder="商品标题"></el-input>
                </el-form-item>
                <el-form-item label="商品图片">
                    <Upload v-model="productToast.form.img"/>
                </el-form-item>
                <el-form-item label="商品条码">
                    <el-input v-model="productToast.form.code" placeholder="商品条码"></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input v-model="productToast.form.stock" placeholder="商品库存"></el-input>
                </el-form-item>
                <el-form-item label="商品价格(元)">
                    <el-input v-model="productToast.form.amount" placeholder="商品价格"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toggleProductToast(null)">取 消</el-button>
                <el-button type="primary" @click="onAddOrUpdateProduct">确 定</el-button>
            </span>
        </el-dialog>
    </PageWrap>
</template>
<style lang="less" scoped>
@import "./index.less";
</style>
<script>
import { queryProducts, createProduct, updateProduct, removeProduct } from "@api/product";
import Upload from "@components/upload";
import PageWrap from "@components/pagewrap";

function productRow (data) {
    const struct = {
        title: "",
        img: "",
        code: "",
        amount: 0,
        stock: "",
    }
    if (data) {
        return Object.keys(struct).reduce((t, c) => {
            t[c] = data[c];
            return t;
        }, {});
    }
    else {
        return JSON.parse(JSON.stringify(struct));
    }
}
productRow.checkMap = {
    title: "标题",
    code: "条码",
    img: "图片",
    amount: "价格",
    stock: "库存",
};

export default {
    components: {
        Upload,
        PageWrap
    },
    data(){
        return {
            HOST: ENV.HOST + "/static",
            list: [],
            keyword: "",
            page: 1,
            limit: 5,
            totalPage: 1,
            productToast: {
                show: false,
                id: "",
                form: productRow()
            }
        }
    },
    mounted () {
        this.loadProducts();
    },
    methods:{
        async loadProducts () {
            const params = {
                page: this.page,
                limit: this.limit,
                keyword: this.keyword
            };
            const { data: { list, totalPage } } = await queryProducts(params);
            this.totalPage = totalPage;
            this.list = list;
        },
        onPageChange (page) {
            this.page = page;
            this.loadProducts();
        },
        toggleProductToast (item) {
            const _ = this.productToast;
            if (!item) {
                _.show = false;
                _.title = "";
                _.id = "";
                _.form = productRow();
            } 
            else if (item === true) {
                _.show = true;
                _.title = "商品入库"
            }
            else {
                _.show = true;
                _.title = "编辑商品\"" + item.title + "\"";
                _.id = item.id;
                _.form = productRow(item);
            }
        },
        async onAddOrUpdateProduct () {
            const 
                _ = this.productToast,
                data = _.form;
            for (let k of Object.keys(productRow.checkMap)) {
                if (!data[k]) return this.$message.warning(`商品${productRow.checkMap[k]}没填写/选择！`);
            }
            if (_.id) {
                data.id = _.id;
                console.log(data);
                var res = await updateProduct(data);
            } else {
                var res = await createProduct(data);
            }
            if (res && res.success) {
                this.toggleProductToast(null);
                this.$message.success(_.id !== undefined ? "已保存" : "已添加");
                this.loadProducts();
            }
        },
        onRemoveProduct (row) {
            this.$confirm(`确定删除"${row.title}"吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await removeProduct({ id: row.id });
                if (res && res.success) {
                    this.$message.success(`已删除"${row.title}"`);
                    this.loadProducts();
                }
            }).catch(() => {});
        }
    }
}
</script>

