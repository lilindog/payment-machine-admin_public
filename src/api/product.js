import request from "@tools/request";

/**
 * 获取商品列表
 */
export function queryProducts (params = {
    page: 1,
    limit: 10,
    keyword: ""
}) {
    return request({
        url: "/queryProducts",
        params
    });
}

/**
 * 新增产品 
 */
export async function createProduct (data = {
    title: "",
    code: "",
    img: "",
    amount: 0,
    stock: ""
}) {
    return request({
        url: "/createProduct",
        method: "POST",
        data
    });
}

/**
 * 更新产品 
 */
export async function updateProduct (data = {
    id: "",
    title: "",
    code: "",
    img: "",
    amount: 0,
    stock: ""
}) {
    return request({
        url: "/updateProduct",
        method: "POST",
        data
    });
}

/**
 * 删除产品 
 */
export async function removeProduct (data = { id: "" }) {
    return request({
        url: "/removeProduct",
        method: "POST",
        data
    });
}
