/*
    1. Menu-btn (line 29)
    2. Cart (line 68)
    3. Modal menu (line 185)
    4. XHR requests (line 300)
    5. Page (line 320)
*/


import './scss/main.scss';
import './scss/media.scss';

document.addEventListener("DOMContentLoaded", function(event) {
  init();
});

function init(){
    setWidth();
    window.addEventListener("resize", ev => setWidth());
    setAllProducts();
    setCategories();
    refreshCart();
}

/*=============================
         - Menu-btn -
===============================*/

 function setWidth(){
  const menuBtn = document.getElementById('menu-btn');
  const menuList = document.getElementById('menu-list');

    if(screen.width <= 1100){
        addClass(menuBtn, 'active');
        removeClass(menuList, 'active');

        document.addEventListener('click', () => menuBtnClick(menuBtn, menuList));
    }
    else{
        if(menuBtn.classList.contains('active')) removeClass(menuBtn, 'active');
        if(menuList.classList.contains('active')) removeClass(menuList, 'active');
    }
  }

  function menuBtnClick(menuBtn, menuList){
    if(menuBtn.classList.contains('active')){
        removeClass(menuBtn,'active');
        addClass(menuList, 'active');
    } else{
        removeClass(menuList, 'active');
        addClass(menuBtn, 'active')
    }
  }

  function addClass(el, cl){
    el.classList.add(cl);
  }

  function removeClass(el, cl){
    el.classList.remove(cl);
  }


/*=============================
         - Cart -
===============================*/

  const cartArray = JSON.parse(localStorage.getItem('cart')) == null ? [] : JSON.parse(localStorage.getItem('cart'));
  const cart = document.getElementsByClassName('cart__link');

  function initCart(){
    
    var products = document.getElementsByClassName('product');

    for(let product in products){
      var productBtn = document.getElementsByClassName('product__btn')[product];

      if(product < products.length) {

        productBtn.addEventListener('click', function addToCart(ev){
          ev.preventDefault();
          const htmlPrice = products[product].getElementsByClassName('product__price')[0].textContent;
          const htmlName = products[product].getElementsByClassName('product__title')[0].textContent;
        
          const img = products[product].getElementsByClassName("product__img")[0].src;
          const price =parseFloat(getPrice(htmlPrice));
          const name = getName(htmlName);
          var isPresent = false;

          cartArray.forEach(el => {
            if(el.id == products[product].id){
              el.amount++;
              isPresent = true;
            }
          });
        
          if(isPresent == false)
            cartArray.push(makeCartEl(products[product].id, price, name, img))
      
          refreshCart();
        });

      }
    }

  }

  function makeCartEl(id, price, name, img){
    return {
      id: id,
      price: price,
      name: name,
      amount: 1,
      currency: "$",
      img: img
    }
  }

  function addToLocalStorageCart(){
      localStorage.setItem('cart', JSON.stringify(cartArray));
      return false;
  }

function refreshCart(){
  var amount = 0;
  var sum = 0;
  cartArray.forEach(element => {
    amount += element.amount
    sum += element.price * element.amount;
  });

  const cartAmount = document.getElementsByClassName('cart__amount')[0];
  cartAmount.textContent = amount;

  const cartSum = document.getElementsByClassName("cart__price")[0];
  const currency = document.getElementsByClassName("currency")[0].textContent;
  cartSum.innerHTML = `${sum.toFixed(2)} <span class="currency">${currency}</span>`

  addToLocalStorageCart();
  refreshModal(sum);
}

  function getPrice(str){
    var isCurrencyPassed = false;
    var ans = "";
    for(let i = 1; i < str.length; i++){
      if(str[i] == '\n') {
        isCurrencyPassed = true;
        continue;
      } else if(str[i] != ' ' && isCurrencyPassed == true) {
        var k = i + 1;
        while(str[k] != '\n' && str[k] != ' ' && k < str.length)
          ++k;
        ans = str.slice(i, k);
        break;
      }
    }
    return ans;
  }

  function getName(str){
    var isNameStarted = false;
    var ans = "";
    for(let i = 1; i < str.length; i++){
      if(str[i] == '\n' || str[i] != ' ' && isNameStarted == false) {
        isNameStarted = true;
      }
  
      if(isNameStarted == true){
        var k = i + 1;
  
        while(str[k] != '\n' && k < str.length)
          ++k;
        ans = str.slice(i, k);
        break;
      }
    }
    return ans;
  }


/*=============================
         - Modal menu -
===============================*/

function initModal(){
  const modal = document.getElementById('cartModal');
  const modalBtn = document.getElementById("cartBtn");
  const modalSpan = document.getElementsByClassName("modal__close")[0];


  modalBtn.addEventListener('click', ev => {
    ev.preventDefault();
    modal.style.display = "block";
  
}); 
  
  
  modalSpan.addEventListener('click', ev => {
    ev.preventDefault();
    modal.style.display = "none";
  });
  
  
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

}

function refreshModal(total){
  var modalContent;
  modalContent = document.getElementsByClassName("modal__body")[0];

  var modalTotal = document.getElementsByClassName("modal__footer")[0];
  
  if(cartArray.length == 0) {
    modalContent.innerHTML = `Cart is empty`;
    modalTotal.innerHTML = `<h3>Total: ${0}<span class = "currency">$</span></h3>`
  } else{
    modalContent.innerHTML = "";
    cartArray.forEach(element => {
      modalContent.innerHTML += createProductHTML(element.name, element.price, element.amount, element.currency, element.img, element.id);
    });

  modalTotal.innerHTML = `<h3>Total: ${total.toFixed(2)}<span class = "currency">$</span></h3>
  <button class="modal__btn" id = "modal__btn">Buy</button>`
  }

  setModalBuyBtn();
  setModalCloseBtns();
  setModalAmountBtns();
  setModalProducts();
}

function createProductHTML(name, price, amount, currency,img,id){
  return `<div class = "cartItem" data-id = "${id}">
    <div class = "cartItem__img--wrapper">
      <img src="${img}" class = "cartItem__img">
    </div>
    <div class="cartItem__descr--wrapper">
      <a class = "cartItem__name" href="#" >${name.length <= 20 ? name : name.substr(0, 20).concat(" ...")}</a>
      <div class = "cartItem__amount-bar">
        <button class = "cartItem__btn-m cartItem__btn" >-</button>
        ${amount}
        <button class = "cartItem__btn-pl cartItem__btn">+</button>
      </div>
      <span class="cartItem__price">
        ${(price * amount).toFixed(2)} <span class = "currency">${currency}</span>
      </span>
      <button class="cartItem__close">&times;</button>
    </div>
  </div>`;
}

function setModalCloseBtns(){
  let cartItems = document.getElementsByClassName('cartItem');

  for(let cartItem in cartItems){
    let btn = document.getElementsByClassName("cartItem__close")[cartItem];

    if(cartItem < cartItems.length){
      btn.addEventListener('click', ev => {
        ev.preventDefault();
        cartArray.splice(cartItem, 1);
        refreshCart(cart[0]);
      });
    }

  }
}

function setModalAmountBtns(){
  var cartItems = document.getElementsByClassName('cartItem');
  
  for(let cartItem in cartItems){
    var btnMinus = document.getElementsByClassName("cartItem__btn-m")[cartItem];
    var btnPlus = document.getElementsByClassName("cartItem__btn-pl")[cartItem];

    if(cartItem < cartItems.length){
      btnMinus.addEventListener('click', ev => {
        ev.preventDefault();
    
        if(cartArray[cartItem].amount == 1) cartArray.splice(cartItem, 1);
        else cartArray[cartItem].amount--;
        refreshCart(cart);
      });

      btnPlus.addEventListener('click', ev =>{
        ev.preventDefault();
        cartArray[cartItem].amount++;
        refreshCart(cart);
      });
    }

  }
}

function setModalProducts(){
  const products = document.getElementsByClassName("cartItem__name");
  const modal = document.getElementById('cartModal');
  const productModal = document.getElementById("product-modal");

  for(let i = 0; i < products.length; i++){
    products[i].addEventListener("click", () => {
        modal.style.display = "none";
        productModal.style.display = "block";

       setProductModal(products[i].parentElement.parentElement.dataset.id);
    });
  }
}

function setModalBuyBtn(){
  const btn = document.getElementById("modal__btn");
  const modal = document.getElementById('cartModal');
  const order = document.getElementById("order");

  btn.addEventListener("click", () => {
    modal.style.display = "none";
    order.style.display="block";

    initOrder();
  });
}


/*=============================
         - XHR requests -
===============================*/

const xhr = new XMLHttpRequest();

function get(api){
  xhr.open('GET', api, false);
  xhr.send();

  if (xhr.status != 200) {
    alert( xhr.status + ': ' + xhr.statusText );
  } else {
    let arr = JSON.parse(xhr.responseText);
    return arr;
  }
}


/*=============================
         - Page -
===============================*/

function setProducts(products){

  let productsContainer = document.getElementsByClassName("products")[0];
  productsContainer.innerHTML = "";
  for(let product in products){
    productsContainer.innerHTML += createMainProduct(products[product]["id"], products[product]["image_url"], products[product]["name"], products[product]["price"], products[product]["special_price"]);
  }

  initProductsModal();
  initCart();
  initModal();
  setResults(products.length);
  
}

function setAllProducts(){
  const all = get('https://nit.tron.net.ua/api/product/list');
  setProducts(all);
}

function createMainProduct(id, img, name, price, specialPrice){
  return `<div class="product" id=${id}>
  <button href="#" class="product__link">
      <div class="product__img--wrapper">
          <img src=${img} alt="" class="product__img">
      </div>
      
      <h3 class="product__title">
          ${name.length <= 28 ? name : name.substr(0, 28).concat(" ...")}
      </h3>
      <span class="product__price" data-descr=${specialPrice != null ? price : ""}>
          <span class="currency">$</span>
          ${specialPrice != null ? specialPrice : price}
      </span>
      <button class="product__btn" type="button">
          add to cart
          <i class="material-icons product__btn-icon">add</i>
      </button>
  </button>
</div>`
}

function setCategories(){
  const categories = get('https://nit.tron.net.ua/api/category/list');
  
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = "";

  categorySelect.innerHTML += `<option class="category__option" data-id="all">All products</option>`
 
  for(let category in categories){
    categorySelect.innerHTML += `<option class="category__option" data-id=${categories[category]["id"]}>${categories[category]["name"]}</option>`
  }

  categorySelect.addEventListener("change", () => setProductsByCategory());
 
}


function setProductsByCategory(){
  const options = document.getElementsByClassName('category__option');
  const selector = document.getElementById('category');
  
  const id = options[selector.selectedIndex].getAttribute("data-id");

  id == "all" ? setAllProducts() : setProducts(get(`https://nit.tron.net.ua/api/product/list/category/${id}`));

}

function setResults(amount){
  const results = document.getElementById('products-amount');

  results.innerHTML = amount
}

/*=============================
         - Product modal -
===============================*/

function initProductsModal(){
  const modal = document.getElementById("product-modal");
  const close = document.getElementById("product-modal__close");

  close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", () =>{
    if (event.target == modal) {
        modal.style.display = "none";
    }
  });

  const products = document.getElementsByClassName("product__link");
  for(let i = 0; i < products.length; i++){
    products[i].addEventListener("click", () => {
      modal.style.display = "block";
      setProductModal(products[i].parentElement.id);
    })
  }

}

function setProductModal(id){

  const product = get(`https://nit.tron.net.ua/api/product/${id}`);

  const modal = document.getElementById("product-modal__body");
  modal.innerHTML = `
  <img src = ${product["image_url"]} class = "product-modal__img">
  <div class = "product-modal__info">
    <span class = "product-modal__title"> ${product["name"]}</span>
    <span class = "product-modal__price" data-descr=${product["special_price"] != null ? product["special_price"] : ""}>${parseFloat(product["price"]).toFixed(2)}<span class = "currency">$</span></span>
    <p class = "product-modal__descr">${product["description"]}</p>
    <button class="product__btn product-modal__btn" type="button">
      add to cart
      <i class="material-icons product__btn-icon">add</i>
    </button>
  </div>
  `;

  initProductModalBtns(product);
  

}

function initProductModalBtns(product){
  const btn = document.getElementsByClassName("product-modal__btn")[0];
  btn.addEventListener("click", () =>{
    let isPresent = false;

    cartArray.forEach(el => {
      if(el.id == product["id"]){
        el.amount++;
        isPresent = true;
      }
    });
  
    if(isPresent == false)
      cartArray.push(makeCartEl(product["id"], product["price"], product["name"], product["image_url"]));

    refreshCart();
  });
}

/*=============================
         - Order -
===============================*/

function initOrder(){
  const order = document.getElementById("order");
  const close= document.getElementsByClassName("order__close")[0];
  
  
  
  close.addEventListener('click', ev => {
    ev.preventDefault();
    order.style.display = "none";
  });
  
  
  window.onclick = function(event) {
      if (event.target == order) {
          order.style.display = "none";
      }
  }

  const form = document.forms.order;
 form.addEventListener("submit", (event) =>sunbmitForm(event, form)); 
 

}

function sunbmitForm(event, form){
  event.preventDefault();

  var data = new FormData(form);
  
  data.append("token", "3Gqhk47xwHlwH_u3jc-4");

  if(cartArray.length == 0) return;
  cartArray.forEach(element => {
  data.append(`products[${element["id"]}]`, `${element["amount"]}`);
});


const request = new XMLHttpRequest();
  request.open("POST", "https://nit.tron.net.ua/api/order/add", false);
   
  request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200){
      }
  }
  request.send(data);

  console.log(document.getElementById("order__form"));

  const order = document.getElementById("order__content");
  order.innerHTML = `<div class="order__header">
  <span class="order__close">&times;</span>
  <h2>Make an order</h2>
</div>
<div class="last-message"><span>Ми з вами зв'яжемося</span></div>`

  cartArray.length = 0;
  refreshCart();

  form.removeEventListener('submit', submitForm());
  
}