import{e as m,S as p,h as B,i as O,j as A,T as $,k as C}from"./utils-DNIPmgBY.js";import{s as d,h as l}from"./main-Dw0SVMKm.js";let c=!0;const S=async()=>{try{d(),s=(await C()).data.orders,s=f(s,c),i(),u()}catch(t){console.error(t.response.data.message)}finally{l()}},g=document.querySelector(".orderPage-table tbody");let s=[];const i=()=>{f(s,c),g.innerHTML=s.map(t=>{let r=t.products.map(e=>`<p>${e.title} x ${e.quantity}</p>`).join("");return`<tr data-id="${t.id}">
            <td>${t.id}</td>
            <td>
              <p>${t.user.name}</p>
              <p>${t.user.tel}</p>
            </td>
            <td>${t.user.address}</td>
            <td>${t.user.email}</td>
            <td>
              ${r}
            </td>
            <td>${m(t.createdAt)}</td>
            <td class="orderStatus">
              ${t.paid?'<a href="#" style="color: green">已處理</a>':'<a href="#" style="color: red">未處理</a>'}
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
          </tr>`}).join("")},T=document.querySelector(".discardAllBtn"),w=async()=>{try{(await p.fire({title:"您確定要刪除「全部」訂單嗎？",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"確定",cancelButtonText:"取消"})).isConfirmed&&(d(),s=(await B()).data.orders,i(),u())}catch(t){console.error(t.response.data.message||"刪除該筆訂單失敗")}finally{l()}};T.addEventListener("click",w);const b=async t=>{try{(await p.fire({title:"您確定要刪除該筆訂單嗎？",text:t,icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"確定",cancelButtonText:"取消"})).isConfirmed&&(d(),s=(await O(t)).data.orders,i(),u())}catch(r){console.error(r.response.data.message||"刪除該筆訂單失敗")}finally{l()}},q=async t=>{const r=s.find(n=>n.id===t),e={data:{id:t,paid:!r.paid}};try{d(),s=(await A(e)).data.orders,i(),$.fire({icon:"success",title:"訂單狀態修改成功"})}catch(n){console.error(n.response.data.message||"訂單狀態修改失敗")}finally{l()}};g.addEventListener("click",t=>{const r=t.target.closest("tr").getAttribute("data-id");t.target.classList.contains("delSingleOrder-Btn")&&b(r),t.target.nodeName==="A"&&(t.preventDefault(),q(r))});const f=(t,r)=>t.sort((e,n)=>r?n.createdAt-e.createdAt:e.createdAt-n.createdAt),v=document.querySelector(".sortBtn");v.addEventListener("click",t=>{t.preventDefault(),c=!c,f(s,c),i()});const u=()=>{const t={};s.forEach(r=>{r.products.forEach(e=>{t[e.category]===void 0?t[e.category]=e.price*e.quantity:t[e.category]+=e.price*e.quantity})}),h(Object.entries(t))},E=()=>{const t={};s.forEach(o=>{o.products.forEach(a=>{t[a.title]===void 0?t[a.title]=a.price*a.quantity:t[a.title]+=a.price*a.quantity})});const e=Object.entries(t).sort((o,a)=>a[1]-o[1]),n=[];let y=0;e.forEach((o,a)=>{a<=2&&n.push(o),a>2&&(y+=o[1])}),e.length>3&&n.push(["其他",y]),h(n)},h=t=>{c3.generate({bindto:"#chart",color:{pattern:["#DACBFF","#9D7FEA","#5434A7"]},data:{type:"pie",columns:t}})},L=document.querySelector(".section-title"),D=document.querySelector(".chartBtnWrap"),j=document.querySelectorAll(".chartBtn");D.addEventListener("click",t=>{t.preventDefault(),t.target.classList.contains("chartBtn")&&(j.forEach(r=>{r.classList.remove("active")}),L.textContent=t.target.textContent,t.target.classList.add("active")),t.target.dataset.char==="byCategory"&&u(),t.target.dataset.char==="byTitle"&&E()});const x=()=>{S()};x();
