const shopPhone="9001257658";
const seed=[
{id:1,name:"Classic Casual Shirt",cat:"Shirts",price:549,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:2,name:"Checked Pattern Shirt",cat:"Shirts",price:549,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:3,name:"Solid Formal Shirt",cat:"Shirts",price:549,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:4,name:"Printed Casual Shirt",cat:"Shirts",price:549,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:5,name:"Basic Round-Neck T-Shirt",cat:"T-Shirts",price:399,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:6,name:"Printed Graphic T-Shirt",cat:"T-Shirts",price:449,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:7,name:"Classic Blue Jeans",cat:"Jeans",price:849,image:"",sizes:"28, 30, 32, 34, 36, 38"},
{id:8,name:"Black Denim Jeans",cat:"Jeans",price:849,image:"",sizes:"28, 30, 32, 34, 36, 38"},
{id:9,name:"Slim Fit Jeans",cat:"Jeans",price:849,image:"",sizes:"28, 30, 32, 34, 36, 38"},
{id:10,name:"Regular Fit Jeans",cat:"Jeans",price:849,image:"",sizes:"28, 30, 32, 34, 36, 38"},
{id:11,name:"Smart Casual Pants",cat:"Pants",price:699,image:"",sizes:"28, 30, 32, 34, 36, 38"},
{id:12,name:"Everyday Cotton Kurta",cat:"Kurtas",price:699,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:13,name:"Lightweight Jacket",cat:"Jackets",price:1199,image:"",sizes:"S, M, L, XL, XXL, 3XL"},
{id:14,name:"Everyday Shorts",cat:"Shorts",price:349,image:"",sizes:"S, M, L, XL, XXL"},
{id:15,name:"Men's Fashion Accessories",cat:"Accessories",price:199,image:"",sizes:"One size"}
]
let products=JSON.parse(localStorage.getItem("hc_products")||"null")||seed;
let cart=JSON.parse(localStorage.getItem("hc_cart")||"[]"),category="All",customer=JSON.parse(localStorage.getItem("hc_customer")||"null");
const $=id=>document.getElementById(id), money=n=>"₹"+Number(n).toLocaleString("en-IN");
function save(){localStorage.setItem("hc_products",JSON.stringify(products));localStorage.setItem("hc_cart",JSON.stringify(cart))}
function renderFilters(){let cats=["All","Shirts","T-Shirts","Jeans","Pants","Kurtas","Jackets","Accessories","Shorts"];$("filters").innerHTML=cats.map(c=>`<button class="filter ${c===category?'active':''}" data-cat="${c}">${c}</button>`).join("");document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{category=b.dataset.cat;renderFilters();renderProducts()})}
function renderProducts(){let list=products.filter(p=>category==="All"||p.cat===category);$("productTotal").textContent=list.length+" styles";$("products").innerHTML=list.map(p=>`<article class="product"><div class="photo">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.remove()">`:`<div class="placeholder">H C</div>`}</div><h3>${esc(p.name)}</h3><div class="meta">${esc(p.cat)} · ${esc(p.sizes||"Sizes available")}</div><div class="price">${money(p.price)}</div><button class="add" data-add="${p.id}">ADD TO BAG</button></article>`).join("");document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(+b.dataset.add))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function add(id){let p=products.find(x=>x.id===id);let found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});save();renderCart();openCart()}
function renderCart(){$("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);$("cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(y=>y.id===x.id);if(!p)return"";return `<div class="cartrow"><div class="cartthumb">${p.image?`<img src="${esc(p.image)}" style="width:100%;height:100%;object-fit:cover">`:"HC"}</div><div style="flex:1"><h4>${esc(p.name)}</h4><p>${money(p.price)} each</p><div class="qty"><button data-q="${p.id}" data-d="-1">−</button>${x.qty}<button data-q="${p.id}" data-d="1">+</button><b style="margin-left:auto">${money(p.price*x.qty)}</b></div></div></div>`}).join(""):`<p class="muted">Your bag is empty. Add a few styles to get started.</p>`;let total=cart.reduce((a,x)=>a+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);$("cartTotal").textContent=money(total);document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{let x=cart.find(i=>i.id===+b.dataset.q);x.qty+=+b.dataset.d;if(x.qty<1)cart=cart.filter(i=>i!==x);save();renderCart()})}
function openCart(){$("shade").classList.add("show");$("cartDrawer").classList.add("open")}
function closeAll(){$("shade").classList.remove("show");$("cartDrawer").classList.remove("open");document.querySelectorAll(".modal").forEach(m=>m.classList.remove("show"))}
$("cartOpen").onclick=openCart;$("shade").onclick=closeAll;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);
$("checkout").onclick=()=>{if(!cart.length)return alert("Your bag is empty.");if(!customer){$("accountModal").classList.add("show");return}sendOrder()};
$("saveAccount").onclick=()=>{let name=$("custName").value.trim(),phone=$("custPhone").value.trim();if(!name||!/^[6-9]\d{9}$/.test(phone))return alert("Please enter your name and valid 10-digit mobile number.");customer={name,phone};localStorage.setItem("hc_customer",JSON.stringify(customer));closeAll();openCart();sendOrder()};
function sendOrder(){let lines=cart.map(x=>{let p=products.find(y=>y.id===x.id);return `${p.name} x ${x.qty} — ${money(p.price*x.qty)}`});let total=cart.reduce((a,x)=>a+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);let msg=`Hello HARIOM COLLECTION, I want to place an order.%0AName: ${encodeURIComponent(customer.name)}%0AMobile: ${encodeURIComponent(customer.phone)}%0A%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(money(total))}%0APlease confirm size, stock and delivery.`;window.open(`https://wa.me/91${shopPhone}?text=${msg}`,"_blank")}
$("adminOpen").onclick=()=>$("adminModal").classList.add("show");
$("adminLogin").onclick=()=>{if($("adminPass").value!=="HARIOM2026")return alert("Demo passcode is incorrect.");$("adminArea").classList.remove("hidden")};
$("addProduct").onclick=()=>{let name=$("pName").value.trim(),price=+$("pPrice").value;if(!name||price<=0)return alert("Enter product name and valid price.");products.unshift({id:Date.now(),name,price,cat:$("pCat").value,image:$("pImage").value.trim(),sizes:$("pSizes").value});save();renderProducts();$("pName").value=$("pPrice").value=$("pImage").value="";alert("Product added on this device.")};
renderFilters();renderProducts();renderCart();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
