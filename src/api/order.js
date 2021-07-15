import request from "@tools/request";

/**
 * 获取订单列表
 */
export function queryOrders (params = {
    page: 1,
    limit: 10,
    status: -1
}) {
    return request({
        url: "/queryOrders",
        params
    });
}

/**
 * 获取指定订单支付记录日志
 */
export function getPaylog (params = {
    orderNumber
}) {
    return request({
        url: "/getPaylog",
        params
    });
}

/**
 * 已支付订单退款 
 */
export function refund (data = { orderNumber: "" }) {
    return request({
        url: "/refund",
        method: "POST",
        data
    });
}

/**
 * 获取订单退款日志 
 */
export function getRefundLog (params = { orderNumber }) {
    return request({
        url: "/getRefundLog",
        params
    });
}