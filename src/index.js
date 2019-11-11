import './scss/main.scss';
import './scss/media.scss';

document.addEventListener("DOMContentLoaded", function(event) {
    init();
  });

function init(){
    menuBtn = menuBtn[0];
    menuList = menuList[0];
    
    setWidth();
    window.addEventListener("resize", ev => setWidth());
    initCart();
    initModal();
}

// menu-btn

var menuBtn = document.getElementsByClassName('menu-btn');
var menuList = document.getElementsByClassName('menu');

 function setWidth(){
    if(screen.width <= 1100){
        addClass(menuBtn, 'active');
        removeClass(menuList, 'active');

        menuBtn.addEventListener('click', () => menuBtnClick(menuBtn));
    }
    else{
        if(menuBtn.classList.contains('active')) removeClass(menuBtn, 'active');
        if(menuList.classList.contains('active')) removeClass(menuList, 'active');
    }
  }

  function menuBtnClick(){
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


// cart

  const cartArray = [];

  const cart = document.getElementsByClassName('cart__link');
  function initCart(){
    
    var products = document.getElementsByClassName('product');
    var productBtns =[];

    for(let product in products){
      var productBtn = document.getElementsByClassName('product__btn')[product];

      if(product < products.length) {

        productBtn.addEventListener('click', function addToCart(ev){
          ev.preventDefault();
          const priceText = products[product].getElementsByClassName('product__price')[0].textContent;
          const nameText = products[product].getElementsByClassName('product__title')[0].textContent;
          const img = products[product].getElementsByClassName("product__img")[0].src;

          var price = parseFloat(getPrice(priceText));
          var name = getName(nameText);
          var isPresent = false;

          cartArray.forEach(el => {
            if(el.id == products[product].id){
              el.amount++;
              isPresent = true;
            }
          });
        
          if(isPresent == false)
            cartArray.push(makeCartEl(products[product].id, price, name, img))
      
          refreshCart(cart[0]);
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

function refreshCart(cart){
  var amount = 0;
  var sum = 0;
  cartArray.forEach(element => {
    amount += element.amount
    sum += element.price * element.amount;
  });

  const cartAmount = cart.getElementsByClassName('cart__amount')[0];
  cartAmount.textContent = amount;

  const cartSum = cart.getElementsByClassName("cart__price")[0];
  const currency = cart.getElementsByClassName("currency")[0].textContent;
  cartSum.innerHTML = `${sum.toFixed(2)} <span class="currency">${currency}</span>`

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

// modal


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
      modalContent.innerHTML += createProductHTML(element.name, element.price, element.amount, element.currency, element.img);
    });

  modalTotal.innerHTML = `<h3>Total: ${total.toFixed(2)}<span class = "currency">$</span></h3>`
  }

  setModalCloseBtns();
  setModalAmountBtns();
}

function createProductHTML(name, price, amount, currency,img){
  return `<div class = "cartItem">
    <div class = "cartItem__img--wrapper">
      <img src="${img}" class = "cartItem__img">
    </div>
    <div class="cartItem__descr--wrapper">
      <a class = "cartItem__name" href="#" >${name}</a>
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
  var cartItems = document.getElementsByClassName('cartItem');

  for(let cartItem in cartItems){
    var btn = document.getElementsByClassName("cartItem__close")[cartItem];

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
        refreshCart(cart[0]);
      });

      btnPlus.addEventListener('click', ev =>{
        ev.preventDefault();
        cartArray[cartItem].amount++;
        refreshCart(cart[0]);
      });
    }

  }
}