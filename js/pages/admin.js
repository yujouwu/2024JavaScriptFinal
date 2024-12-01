import * as api from '../api';

import { Swal, Toast } from "../sweetalert2";
import { showLoading, hideLoading } from "../loading";
import { formatTimestamp, formatNumber } from "../utils";

// 訂單排序
let isDescending  = true; 

// 取得訂單列表
const getOrder = async() => {
  try{
    showLoading();
    const response = await api.getOrder();
    orderData = response.data.orders;

    // 調用排序函式
    orderData = sortOrderData(orderData, isDescending)
    renderOrder(); 
    calcProductCategory();
  }catch(error){
    console.error(error.response.data.message)
  } finally{
    hideLoading();
  }
}

// 渲染訂單列表
const orderPageTableBody = document.querySelector('.orderPage-table tbody');
let orderData = [];

const renderOrder = () => {
  sortOrderData(orderData, isDescending);
  orderPageTableBody.innerHTML = orderData.map(order => {
    let orderProduct = order.products.map(product => `<p>${product.title} x ${product.quantity}</p>`).join('');
    return `<tr data-id="${order.id}">
            <td>${order.id}</td>
            <td>
              <p>${order.user.name}</p>
              <p>${order.user.tel}</p>
            </td>
            <td>${order.user.address}</td>
            <td>${order.user.email}</td>
            <td>
              ${orderProduct}
            </td>
            <td>${formatTimestamp(order.createdAt)}</td>
            <td class="orderStatus">
              ${order.paid 
                ? '<a href="#" style="color: green">已處理</a>'
                : '<a href="#" style="color: red">未處理</a>'
              }
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
          </tr>`}).join('');
  
}

// 刪除全部訂單
const discardAllBtn = document.querySelector('.discardAllBtn');
const deleteOrderAll = async() => {
  try{
    // 呼叫 SweetAlert 確認框
    const result = await Swal.fire({
      title: "您確定要刪除「全部」訂單嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    });
    // 如果使用者確認，執行刪除操作
    if(result.isConfirmed){
      showLoading();
      const response = await api.deleteOrderAll();
      orderData = response.data.orders;
      renderOrder();
      calcProductCategory();
    }
  }catch(error){
    console.error(error.response.data.message || '刪除該筆訂單失敗')
  } finally {
    hideLoading();
  }
}
discardAllBtn.addEventListener('click', deleteOrderAll);

// 刪除特定訂單
const deleteOrderOne = async(orderId) => {
  try{
    // 呼叫 SweetAlert 確認框
    const result = await Swal.fire({
      title: "您確定要刪除該筆訂單嗎？",
      text: orderId,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    });
    // 如果使用者確認，執行刪除操作
    if(result.isConfirmed){
      showLoading();
      const response = await api.deleteOrderOne(orderId);
      orderData = response.data.orders;
      renderOrder();
      calcProductCategory();
    }
  }catch(error){
    console.error(error.response.data.message || '刪除該筆訂單失敗')
  } finally {
    hideLoading();
  }
}

// 修改訂單狀態
const updateOrderStatus = async(orderId) => {
  const targetOrder = orderData.find(order => order.id === orderId);
  const data = {
    "data": {
      "id": orderId,
      "paid": !targetOrder.paid,
    }
  };
  try{
    showLoading();
    const response = await api.updateOrderStatus(data);
    orderData = response.data.orders;
    renderOrder();
    // 呼叫 SweetAlert Toast
    Toast.fire({
      icon: "success",
      title: "訂單狀態修改成功"
    });
  }catch(error){
    console.error(error.response.data.message || '訂單狀態修改失敗')
  } finally {
    hideLoading();
  }
}

orderPageTableBody.addEventListener('click', (e) => {
  const orderId = e.target.closest('tr').getAttribute('data-id');
  if(e.target.classList.contains('delSingleOrder-Btn')){
    deleteOrderOne(orderId);
  }
  if (e.target.nodeName === 'A'){
    e.preventDefault();
    updateOrderStatus(orderId);
  }
})

// 定義排序函式
const sortOrderData = (orderData, isDescending) => {
  return orderData.sort((a, b) => {
    return isDescending ?  b.createdAt - a.createdAt : a.createdAt - b.createdAt;
})}
const sortBtn = document.querySelector('.sortBtn');
sortBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isDescending = !isDescending;
  sortOrderData(orderData, isDescending);
  renderOrder();
})

// 渲染圖表
// LV1 圓餅圖 - 全產品類別營收比重，類別含三項，共有：床架、收納、窗簾
// 1. 組成資料
// 2. 渲染圖表
const calcProductCategory = () => {
  const resultObj = {};
  orderData.forEach(order => {
    order.products.forEach(product => {
      if (resultObj[product.category] === undefined){
        resultObj[product.category] = product.price * product.quantity;
      }else{
        resultObj[product.category] += product.price * product.quantity;
      }
    })
  })
  renderChart(Object.entries(resultObj));
}

// LV2 圓餅圖 - 全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」
// 1. 組成資料
// 2. 渲染圖表
const calcProductTitle = () => {
  const resultObj = {};
  orderData.forEach(order => {
    order.products.forEach(product => {
      if (resultObj[product.title] === undefined){
        resultObj[product.title] = product.price * product.quantity;
      }else{
        resultObj[product.title] += product.price * product.quantity;
      }
    })
  })

  const resultArr = Object.entries(resultObj);
  const sortResultArr = resultArr.sort((a, b) => {
    return b[1] - a[1]
  })
  
  const top3Product = [];
  let otherProductTotal = 0; 
  sortResultArr.forEach((product, index) => {
    if(index <= 2) {
      top3Product.push(product);
    }
    if (index > 2) {
      otherProductTotal += product[1];
    }
  })
  if (sortResultArr.length > 3){
    top3Product.push(['其他', otherProductTotal])
  }
  renderChart(top3Product);
}

// C3.js
const renderChart = (data) => {
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    color: {
      pattern: ['#DACBFF', '#9D7FEA', '#5434A7']
    },
    data: {
        type: "pie",
        columns: data,
    },
  });
}

// 切換圖表
const sectionTitle = document.querySelector('.section-title');
const chartBtnWrap = document.querySelector('.chartBtnWrap');
const chartBtns = document.querySelectorAll('.chartBtn');
chartBtnWrap.addEventListener('click', (e) => {
  e.preventDefault();
  if(e.target.classList.contains('chartBtn')){
    chartBtns.forEach(btn => {
      btn.classList.remove('active');
    })
    sectionTitle.textContent = e.target.textContent;
    e.target.classList.add('active');
  }
  if(e.target.dataset.char === 'byCategory'){
    calcProductCategory()
  }
  if(e.target.dataset.char === 'byTitle'){
    calcProductTitle()
  }
})

// 初始化
const init = () => {
  getOrder();
}
init();
