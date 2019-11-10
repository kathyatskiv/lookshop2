import './scss/main.scss';



document.addEventListener("DOMContentLoaded", init);
    
const categories = [];
const all = [];
let loaded = 3;
const xhr = new XMLHttpRequest();

function init(){
   // getCategories();
    let categoryid = +prompt("Print category")
    console.log(categoryid);
    let list = getProductByCategory(categoryid);
    loadProducts(list);;
}

function getCategories(){
    xhr.open('GET', 'https://nit.tron.net.ua//api/category/list', false);
    xhr.send();
    
    if (xhr.status != 200) {
      alert( xhr.status + ': ' + xhr.statusText );
    } else {
        let arr = JSON.parse(xhr.responseText);
        arr.forEach( el => {
            categories.push(el);
        });
    }
}

function getAllProducts(){
        xhr.open('GET', 'https://nit.tron.net.ua/api/product/lis', false);
        xhr.send();

        if (xhr.status != 200) {
            alert( xhr.status + ': ' + xhr.statusText );
          } else {
              let arr = JSON.parse(xhr.responseText)
              arr.forEach( e => {
                  if(!isPresent(e)) all.push(e);
              });
          }
}

function getProductByCategory(id){
    console.log(id);
    xhr.open('GET', `https://nit.tron.net.ua/api/product/list/category/${id}`, false);
    xhr.send();

    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText );
    } else {
        let arr = JSON.parse(xhr.responseText);
        console.log(arr);
        let products = []
        arr.forEach( e => {
            products.push(e);
        });
        return products;
     }

}

function isPresent(element){
    let check = false;
    all.forEach(el => {
        if(el.id == element.id) check = true;
    });
    return check;
}

function loadProducts(list){
    let products = document.getElementsByClassName('products')[0];
    products.innerHTML = "";
    for(let i = 0; i < list.length; i++){
        products.innerHTML += `<div class="product" id = pr${list[i].id}>
            <img src=${list[i].image_url} alt="#" class="product__img">
            <h3 class="product__name">${list[i].name}</h3>
            <span class="product__price">${list[i].price}</span>
            <button class="product__btn">Add to cart</button>
        </div>`
    }
}

