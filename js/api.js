import axios from "axios";

const apiPath = 'soniawu';
const baseUrl = 'https://livejs-api.hexschool.io';

// 前台
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;

// 後台
const adminApi = `${baseUrl}/api/livejs/v1/admin/${apiPath}`;
const token = 'ViO621kPyKdxfoLPzuKqqTJrV6Y2';

const headers = {
  headers: {
    Authorization: token,
  }
}
// ===========================================================================
// axios 前台
const customerInstance = axios.create({
  baseURL: customerApi,
})
// axios 後台
const adminInstance = axios.create({
  baseURL: adminApi,
  headers: headers.headers
})
// ===========================================================================
// 前台

// 產品 API
// 取得產品列表
export const getProductList = () => customerInstance.get('/products');

// 購物車 API
// 取得購物車列表
export const getCartList = () => customerInstance.get('/carts');

// 加入購物車
export const addCartItem = (data) => customerInstance.post('/carts', data);

// 編輯購物車產品數量
export const updateQty = (data) => customerInstance.patch('/carts', data);

// 清除購物車內全部產品
export const deleteCartItemAll = () => customerInstance.delete('/carts');

// 刪除購物車內特定產品
export const deleteCartItemOne = (id) => customerInstance.delete(`/carts/${id}`);

// 訂單 API
// 送出購買訂單
export const sendOrder = (data) => customerInstance.post('/orders', data);
// ===========================================================================

// 後台
// 取得訂單列表
export const getOrder = () => adminInstance.get('/orders');

// 刪除全部訂單
export const deleteOrderAll = () => adminInstance.delete('/orders');

// 刪除特定訂單
export const deleteOrderOne = (orderId) => adminInstance.delete(`/orders/${orderId}`);

// 修改訂單狀態
export const updateOrderStatus = (data) => adminInstance.put('/orders', data);