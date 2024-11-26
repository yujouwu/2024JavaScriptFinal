import axios from "axios";
import { apiPath, baseUrl, token } from "./config";
// import { getProductList } from "./api";
import validate from "validate.js";
import { Swal, Toast } from "./sweetalert2";
import { showLoading, hideLoading } from "./loading";

// 渲染產品列表
const productWrap = document.querySelector(".productWrap");

// 篩選
const productSelect = document.querySelector(".productSelect");
const allType = "全部";

// 渲染購物車列表、清除購物車內全部產品、刪除購物車內特定產品
const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);
const shoppingCartTableFoot = document.querySelector(
  ".shoppingCart-table tfoot"
);

// 送出購買訂單
const orderInfoForm = document.querySelector(".orderInfo-form");

// validate 驗證
const orderInfoInputs = document.querySelectorAll('input[type="text"], input[type="tel"],input[type="email"]');
const orderInfoMessages = document.querySelectorAll('.orderInfo-message');
const constraints = {
  姓名: {
    presence: {
      message: "^必填",
    },
  },
  電話: {
    presence: {
      message: "^必填",
    },
    length: {
      minimum: 8,
      message: "^號碼須超過 8 碼",
    },
  },
  Email: {
    presence: {
      message: "^必填",
    },
    email: {
      message: "^請輸入有效的電子郵件地址",
    },
  },
  寄送地址: {
    presence: {
      message: "^必填"
    },
  },
};


let productData = [];
let cartData = [];
let cartTotal = 0;

// 取得產品列表
const getProductList = async () => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`;
  try {
    const response = await axios.get(url);
    // console.log(response.data.products);
    productData = response.data.products;
    renderProduct(productData);
    getCategory();
  } catch (error) {
    console.error(error.response.data || "取得產品列表失敗");
  }
};
// 渲染產品列表
function renderProduct(productData) {
  let str = "";
  productData.forEach((item) => {
    str += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img
          src="${item.images}"
          alt="">
        <a href="#" class="addCartBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
      </li>`;
  });
  productWrap.innerHTML = str;
}

// 篩選產品
function filterProductByCategory() {
  const selectedCategory = productSelect.value;
  const filteredProducts = productData.filter(
    (item) => selectedCategory === allType || selectedCategory === item.category
  );
  renderProduct(filteredProducts);
}

// 取得購物車列表
const getCartList = async () => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
  try {
    const response = await axios.get(url);
    cartData = response.data.carts;
    cartTotal = response.data.finalTotal;
    renderCart(cartData);
    console.log(cartData);
    
  } catch (error) {
    console.error(error.response.data.message);
  }
};

// 渲染購物車列表
function renderCart(cartData) {
  if (cartData.length === 0) {
    shoppingCartTableBody.innerHTML = "購物車沒有商品";
    shoppingCartTableFoot.innerHTML = "";
    return;
  }
  let str = "";
  cartData.forEach((item) => {
    str += `<tr data-id=${item.id}>
          <td>
            <div class="cardItem-title">
              <img src="${item.product.images}" alt="">
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${item.product.origin_price}</td>
          <td><div class="shoppingCart-qty"><button type="button" class="minusBtn">-</button>${
            item.quantity}<button type="button" class="plusBtn">+</button></div></td>
          <td>NT$${item.product.price * item.quantity}</td>
          <td>
            <a href="#" class="material-icons discardBtn">
              clear
            </a>
          </td>
        </tr>`;
  });
  shoppingCartTableBody.innerHTML = str;
  shoppingCartTableFoot.innerHTML = `<tr>
            <td>
              <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
            <td>NT$${cartTotal}</td>
          </tr>`;
}

// 加入購物車
const addCartItem = async (id) => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
  const data = {
    data: {
      productId: id,
      quantity: checkCurrentQty(id) + 1,
    },
  };
  try {
    showLoading();
    const response = await axios.post(url, data);
    cartData = response.data.carts;
    cartTotal = response.data.finalTotal;
    renderCart(cartData);
    Toast.fire({
      icon: "success",
      title: "商品成功加入購物車"
    });
  } catch (error) {
    console.error(error.response.data.message);
  } finally{
    hideLoading();
  }
};

// 檢查當前購物車數量
function checkCurrentQty(id){
  const targetItem = cartData.find(item => item.product.id === id);
  if(targetItem){
    return targetItem.quantity;
  }else{
    return 0;
  }
}

// 清除購物車內全部產品
const deleteCartItemAll = async () => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;

  try {
    // 呼叫 SweetAlert 確認框
    const result = await Swal.fire({
      title: "您確定要刪除所有品項嗎？",
      text: "刪除後將無法復原購物車",
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
      const response = await axios.delete(url);
      cartData = response.data.carts; // 取得更新後的購物車資料
      renderCart(cartData);  // 重新渲染購物車

      // 刪除成功後顯示成功訊息
      Swal.fire({
        title: "購物車已清空！",
        text: "所有品項已刪除",
        icon: "success"
      });
    }
    
  } catch (error) {
    console.error(error.response.data.message);
  } finally {
    hideLoading();
  }
};

// 刪除購物車內特定產品
const deleteCartItemOne = async (id, title) => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts/${id}`;
  
  try {
    // 呼叫 SweetAlert 確認框
    const result = await Swal.fire({
      title: title,
      text: "您確定要刪除該品項嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    });
    // 如果使用者確認，執行刪除操作
    if (result.isConfirmed){
      showLoading();
      const response = await axios.delete(url);
      cartData = response.data.carts; // 取得更新後的購物車資料
      cartTotal = response.data.finalTotal; // 取得更新後的購物車總金額
      renderCart(cartData);  // 重新渲染購物車

      // 刪除成功後顯示成功訊息
      Swal.fire({
        title: title,
        text: "已刪除成功！",
        icon: "success"
      });
    }
  } catch (error) {
    console.error(error.response.data.message);
  } finally {
    hideLoading();
  }
};

// 編輯購物車產品數量
const updateQty = async (cartId, qty) => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`;
  const data = {
    data: {
      id: cartId,
      quantity: qty,
    },
  };
  try {
    showLoading();
    const response = await axios.patch(url, data);
    cartData = response.data.carts;
    cartTotal = response.data.finalTotal;
    renderCart(cartData);
  } catch (error) {
    console.error(error.response.data.message);
  } finally{
    hideLoading();
  }
};

// 送出購買訂單
const sendOrder = async () => {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/orders`;
  const data = {
    data: {
      user: {
        name: document.querySelector("#customerName").value.trim(),
        tel: document.querySelector("#customerPhone").value.trim(),
        email: document.querySelector("#customerEmail").value.trim(),
        address: document.querySelector("#customerAddress").value.trim(),
        payment: document.querySelector("#tradeWay").value.trim(),
      },
    },
  };
  try {
    const response = await axios.post(url, data);
    console.log(response.data);
    console.log("送出訂單成功，感謝您的訂購！");
    orderInfoForm.reset();
    getCartList();
  } catch (error) {
    console.error(error.response.data.message);
  }
};

// validate 驗證
function verification(e){
  e.preventDefault();
  if(cartData.length === 0){
    alert('購物車不得為空');
    return;
  }
  let errors = validate(orderInfoForm, constraints);
  // 如果有誤，呈現錯誤訊息
  if (errors){
    showError(errors)
  }else{
    // 如果沒有錯誤，送出表單
    sendOrder();
  }
}

// validate 驗證: 顯示錯誤訊息
function showError(errors){
  orderInfoMessages.forEach(item => {
    item.textContent = '';
    item.textContent = errors[item.dataset.message];
  })
}

// 監控所有 input 的操作
function validateField(item){
  let errors = validate(orderInfoForm, constraints);
  let targetMsg = document.querySelector(`[data-message=${item.name}]`);
  if(errors){
    targetMsg.textContent = errors[item.name];
  }else{
    targetMsg.textContent = '';
  }
}

// 取得所有產品類別 category for select 篩選
function getCategory(){
  let unSort = productData.map(item => item.category);
  let sorted = unSort.filter((item, index) => unSort.indexOf(item) === index);
  renderCategory(sorted)
}
// 渲染 select 篩選欄位
function renderCategory(sorted){
  let str = '<option value="全部" selected>全部</option>';
  sorted.forEach(item => {
    str += `<option value="${item}">${item}</option>`;
  })
  productSelect.innerHTML = str;
}

function init() {
  getProductList()
  getCartList();
}

init();

// 篩選 監聽
productSelect.addEventListener("change", filterProductByCategory);

// 為「加入購物車」按鈕綁監聽
// 加入購物車：將事件綁定在整個產品列表上，改善效能
productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("addCartBtn")) {
    addCartItem(e.target.dataset.id);
  }
});

shoppingCartTableFoot.addEventListener("click", (e) => {
  // 清除購物車內全部產品
  if (e.target.classList.contains("discardAllBtn")) {
    e.preventDefault();
    deleteCartItemAll();
  }
});

// 購物車區塊的監聽
shoppingCartTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e.target);
  
  const id = e.target.closest("tr").getAttribute("data-id");

  // 刪除購物車內特定產品
  if (e.target.classList.contains("discardBtn")) {
    const title = e.target.closest("tr").querySelector(".cardItem-title p").textContent;
    deleteCartItemOne(id, title);
  }
  // 編輯購物車產品數量「+」
  if (e.target.classList.contains("plusBtn")) {
    const targetCart = cartData.find((item) => item.id === id);
    let qty = targetCart.quantity + 1;
    updateQty(id, qty);
  }
  // 編輯購物車產品數量「-」
  if (e.target.classList.contains("minusBtn")) {
    const targetCart = cartData.find((item) => item.id === id);
    let qty = targetCart.quantity;
    if (qty > 1) {
      qty--;
      updateQty(id, qty);
    } else {
      deleteCartItemOne(id);
    }
  }
});

// 送出購買訂單
orderInfoForm.addEventListener("submit", verification);

// 監控所有 input 的操作
orderInfoInputs.forEach(item => {
  item.addEventListener('change', () => {
    validateField(item);
  })
})

