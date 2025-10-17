const myCarrito = document.querySelector("#myCarrito");

// localStorage;
let arr = JSON.parse(localStorage.getItem("carrito")) || [];

function guardar() {
    localStorage.setItem("carrito", JSON.stringify(arr));
}

// TOTAL
const total = document.querySelector(".total");

// VER PRODUCTO
const addProducto = document.querySelectorAll(".agregar");
const myProducto = document.querySelector(".show-producto");
const verProductoBtn = document.querySelectorAll(".ver");
const verProducto = document.querySelector(".my-producto");
let closeProducto = document.querySelector("#close-producto");

closeProducto.checked = true;
myProducto.style.display = closeProducto.checked ? "none" : "grid";

addProducto.forEach(btn => {
    const item = btn?.closest(".item");
    const itemStock = item?.querySelector(".stock").textContent;
    if(itemStock == "Agotado") {
        btn.disabled = true;
    }
})

verProductoBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        closeProducto.checked = false;
        myProducto.style.display = closeProducto.checked ? "none" : "grid";

        verProducto.classList.add("slide-in-bottom");
        verProducto.classList.remove("slide-out-bottom");

        const item = btn?.closest(".item");
        const itemImg = item?.querySelector(".item-img").src;
        const itemStock = item?.querySelector(".stock").textContent;
        const itemName = item?.querySelector(".item-name").textContent;
        const itemPrecio = item?.querySelector(".item-precio").textContent;
        const itemCode = item?.querySelector("#code").textContent;
        const itemText = item?.querySelector(".item-text").textContent;

        verProducto.innerHTML = 
        `<div class="product-header">
            <div class="state">
                <h2 class="product-name">${itemName}</h2>
            </div>
            <label for="close-producto" class="product-x" onclick="closeShowProducto()">
                <i class="fa-solid fa-xmark"></i>
            </label>
        </div>
        <p class="item-codigo">
            <i class="fa-solid fa-cube icon-cod"></i>
            Código: <span id="show-code">${itemCode}</span>
        </p>
        <div class="product-info">
            <img src="${itemImg}" alt="${itemName}" class="product-img">
            <div class="product-content">
                <div class="state">
                    <h2 class="product-precio">${itemPrecio}</h2>
                    <span class="state-stock">${itemStock}</span>
                </div>
                <p class="des">Descripción</p>
                <p class="des-text">${itemText}</p>
                <div class="product-btn">
                    <button class="add">
                        <i class="fa-solid fa-cart-shopping item-icon"></i>
                        Agregar al Carrito
                    </button>
                    <button class="buy" onclick='buyNow()'>Comprar Ahora</button>
                </div>
            </div>
        </div>`;

        statuBtn(itemStock)
    });
});

function closeShowProducto() {
    verProducto.classList.remove("slide-in-bottom");
    verProducto.classList.add("slide-out-bottom");

    setTimeout(() => {
        myProducto.style.display = "none";
    }, 400);
}

function statuBtn(itemStock) {
    const btnAdd = document.querySelector(".add");
    const btnBuy = document.querySelector(".buy");

    if(itemStock === "Agotado") {
        btnAdd.disabled = true;
        btnBuy.disabled = true;
    }

    btnAdd.addEventListener("click", () => {
        const itemImg = document.querySelector(".product-img").src;
        const itemName = document.querySelector(".product-name").textContent;
        const itemPrecio = document.querySelector(".item-precio").textContent;
        const itemCode = document.querySelector("#code").textContent;

        arr.push({img: itemImg, name: itemName, precio: itemPrecio, codigo: itemCode});

        guardar();
        renderizar();
        showMessage(itemName);
    });
}

function buyNow() {
    // const itemImg = document.querySelector(".product-img").src;
    const itemName = document.querySelector(".product-name").textContent;
    // const itemPrecio = document.querySelector(".item-precio").textContent;
    const itemCode = document.querySelector("#show-code").textContent;

    let message = `Buenas tardes, me gustaría adquirir el siguiente producto: *${itemName}*, código *${itemCode}*.`;

    const url = `https://wa.me/51942428381?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// HEADER - MENU
const enlaces = document.querySelectorAll(".enlace");
let checkMenu = document.querySelector("#my-menu");
let barMenu = document.querySelector("#menu");

barMenu.addEventListener("click", () => {
    if(!checkMenu.checked) {
        barMenu.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        barMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
})
enlaces.forEach(enla => {
    enla.addEventListener("click", () => {
        if(checkMenu.checked) {
            checkMenu.checked = false;
            barMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    })
})

// CARRITO CONTENT 
const contentCarrito = document.querySelector(".carrito-content");
const cantidadCarrito = document.querySelector(".statu-carrito");
const showCantidad = document.querySelector("#counter");

function content() {
    let count =  myCarrito.childElementCount;

    contentCarrito.innerHTML = count === 0 ? 
    `<div class="box-msg">
        <i class="fa-solid fa-bag-shopping msg-icon"></i> 
        <h2 class="msg-title">Tu carrito está vacío</h2>
        <p class="msg-text">Agrega algunos productos para comenzar tu compra</p>
        <label for="slide-carrito" class="msg-btn">
            Continuar Comprando
        </label>
    </div>` : "";

    contentCarrito.style.display = count == 0 ? "grid" : "none";

    cantidadCarrito.textContent = count == 0 ? 'Tu carrito esta vacío' : count == 1 ? `${count} producto en tu carrito` : `${count} productos en tu carrito`;

    showCantidad.textContent = arr.length;
    showCantidad.style.display = arr.length == 0 ? "none" : "grid"

}

content();

addProducto.forEach(btn => {
    btn.addEventListener("click", añadirProductoCarrito);
})

function añadirProductoCarrito() {
    const item = this?.closest(".item");
    const itemImg = item?.querySelector(".item-img").src;
    const itemName = item?.querySelector(".item-name").textContent;
    const itemPrecio = item?.querySelector(".item-precio").textContent;
    const itemCode = item?.querySelector("#code").textContent;

    arr.push({img: itemImg, name: itemName, precio: itemPrecio, codigo: itemCode});

    guardar();
    renderizar();
    showMessage(itemName);
    // console.log(arr);
}

function renderizar() {
    myCarrito.innerHTML = "";

    arr.sort((a,b) => a.name.localeCompare(b.name));

    let obj = {}

    for(let a of arr) {
        if(!obj[a.name]) {
            obj[a.name] = {img: a.img, precio: a.precio, codigo: a.codigo, cantidad: 1};
        } else {
            obj[a.name].cantidad += 1;
        }
    }

    Object.entries(obj).forEach(([key, value], index) => {
        let element = document.createElement("li");
        element.dataset.index = index
        element.className = "content-my-product"
        element.innerHTML = 
        `<img src="${value.img}" class="content-my-product-img" alt="${key}">
        <div class="content-my-product-info">
            <div class="content-my-product-header">
                <h2 class="content-my-product-name">${key}</h2>
                <div class="trash">
                    <i class="fa-regular fa-trash-can"></i>
                </div>
            </div>
            <p class="content-my-product-codigo">${value.codigo}</p>
            <div class="content-my-product-footer">
                <h2 class="content-my-product-precio">${value.precio}</h2>
                <div class="content-my-product-btns">
                    <button class="minus"><i class="fa-solid fa-minus"></i></button>
                    <span class="counter">${value.cantidad}</span>
                    <button class="plus"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        </div>`;
    
        myCarrito.appendChild(element);
    })
    
    content();
    counterProducto(obj);
    verTotal(obj);
}

renderizar();

// localStorage.clear();

function counterProducto(obj) {
    const plus = document.querySelectorAll(".plus");
    const minus = document.querySelectorAll(".minus");
    const trash = document.querySelectorAll(".trash");

    trash.forEach(trash => {
        trash.addEventListener("click", () => {
            const item = trash?.closest(".content-my-product");
            const itemName = item?.querySelector(".content-my-product-name").textContent;

            Object.entries(obj).forEach(([key, value]) => {
                if(itemName == key) {
                    for(let i = 0; i < value.cantidad; i++) {
                        arr.splice(arr.findIndex(p => p.name == key), 1);
                    }
                }
            });

            guardar();
            renderizar();
            content();
            showMessage2();
        });
    });

    plus.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn?.closest(".content-my-product");
            const itemImg = item?.querySelector(".content-my-product-img").src;
            const itemName = item?.querySelector(".content-my-product-name").textContent;
            const itemPrecio = item?.querySelector(".content-my-product-precio").textContent;
            const itemCode = item?.querySelector(".content-my-product-codigo").textContent;

            arr.push({img: itemImg, name: itemName, precio: itemPrecio, codigo: itemCode});
            
            guardar();
            renderizar();
        });
    });

    minus.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn?.closest(".content-my-product");
            const itemName = item?.querySelector(".content-my-product-name").textContent;
            const itemCantidad = item?.querySelector(".counter").textContent;
            
            Object.entries(obj).forEach(([key]) => {
                if(key === itemName && itemCantidad > 1) {
                    arr.splice(arr.findIndex(p => p.name == key), 1);
                }
            });

            guardar();
            renderizar();
        });
    });
}

// SHOW MENSAGE 
const message = document.querySelector(".message");

function showMessage(name) {
    message.style.display = "flex";

    let ele = document.createElement("li");
    ele.className = "li-mss";
    ele.innerHTML = 
    `<h2 class="mss-head">Producto Agregado</h2>
    <p class="mss-foot">${name} se ha agregado al carrito</p>`;

    message.appendChild(ele);

    setTimeout(() => {
        message.removeChild(ele);
        message.style.display = "none";
    }, 3000);
}

function showMessage2() {
    message.style.display = "flex";

    let ele = document.createElement("li");
    ele.className = "li-mss";
    ele.innerHTML = 
    `<h2 class="mss-head">Producto Eliminado</h2>
    <p class="mss-foot">El producto se eliminó del carrito</p>`;

    message.appendChild(ele);

    setTimeout(() => {
        message.removeChild(ele);
        message.style.display = "none";
    }, 3000);
}

// TOTAL
function verTotal(obj) {
    let sum = 0;

    Object.entries(obj).forEach(([key, value]) => {
       sum += parseInt(value.cantidad) * parseFloat(value.precio.replace("S/ ", ''));
    });

    total.innerHTML = myCarrito.childElementCount > 0 ?
    `<div class="total-header">
        <h2>Total:</h2>
        <h2 id="precioFinal">S/ ${sum.toFixed(2)}</h2>
    </div>
    <div class="total-footer">
        <button class="comprar" onclick='comprar()'>Proceder al Pago</button>
        <button class="clear" onclick='clearCarrito()'>Vaciar Carrito</button>
    </div>` : "";
    
    total.style.display = myCarrito.childElementCount > 0 ? "grid" : "none";
}

function clearCarrito() {
    arr.splice(0, arr.length);
    guardar();
    renderizar();
    content();
}

// SHADOW 
const slideCarrito = document.querySelector("#slide-carrito");
slideCarrito.addEventListener("click", () => {
    if(!slideCarrito.checked) {
        document.body.classList.remove("main");
        document.querySelector(".head").classList.remove("main")
    } else {
        document.body.classList.add("main");
        document.querySelector(".head").classList.add("main")
    }
});

// COMPRAR
function comprar() { 
    const total = document.querySelector("#precioFinal").textContent;

    let obj = {}
    let mensaje = "";

    for(let a of arr) {
        if(!obj[a.name]) {
            obj[a.name] = {img: a.img, precio: a.precio, codigo: a.codigo, cantidad: 1};
        } else {
            obj[a.name].cantidad += 1;
        }
    }

    Object.entries(obj).forEach(([key, value], index) => {
        mensaje += `\n*${index+1}.${key}*\nCódigo: *${value.codigo}*\nCantidad: ${value.cantidad}\n------------`
    });

    let mensaje2 = `*Solicito los siguientes productos*:\n${mensaje}\n*Total a pagar*: *${total}*`;
    
    const url = `https://wa.me/51942428381?text=${encodeURIComponent(mensaje2)}`;

    window.open(url, "_blank");
}