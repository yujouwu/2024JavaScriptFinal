// import axios from "axios";
// import { apiPath, baseUrl, token } from "./config";

// // 取得產品列表
// export const getProductList = async () => {
//   const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`;
//   try {
//     const response = await axios.get(url);
//     productData = response.data.products;
//     renderProduct(productData);
//     getCategory();
//   } catch (error) {
//     console.error(error.response.data || "取得產品列表失敗");
//   }
// };