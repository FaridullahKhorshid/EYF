init(function () {
    updateShoppingCart();
})

function updateShoppingCart() {
    fetch('/shop/get_cart')
        .then(r => r.text())
        .then((data) => {
            document.getElementById('shopping_cart_container').innerHTML = data;
        });
}

function addToShoppingCart(element) {
    const productOrder = getProductInfo(element);
    if (productOrder.amount > 0) {
        const existingProducts = getCookie('shoppingCart');
        const index = (existingProducts ? existingProducts.findIndex(product => product.id === productOrder.id) : 0);

        if (existingProducts) {
            if (existingProducts[index]) {
                existingProducts[index].amount += productOrder.amount;
            } else {
                existingProducts.push(productOrder);
            }

            createCookie('shoppingCart', JSON.stringify(existingProducts));

        } else {
            let newOrder = [];
            newOrder.push(productOrder)
            createCookie('shoppingCart', JSON.stringify(newOrder))
        }

        setTimeout(function () {
            updateShoppingCart();
            updateCartTotal(getCookie('shoppingCart'));
        }, 150)
    }
}

function getProductInfo(element) {
    const productId = parseInt(element.dataset.id, 0);
    if (productId > 0) {
        const select = document.querySelector('#quantity-' + productId);
        const amount = parseInt(select.options[select.selectedIndex].text, 0);
        const productName = element.dataset.name;
        const productType = element.dataset.product_type;
        const productPrice = element.dataset.price;

        return {
            id: productId,
            price: productPrice,
            name: productName,
            amount: amount,
            type: productType
        }
    }
}

function createCookie(name, value, expires = '') {
    document.cookie = name + "=" + value + expires + "; path=/"
}

function getCookie(name) {
    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    if (v) {
        return JSON.parse(v[2])
    } else {
        return false
    }
}

function removeFromShoppingCart(element) {
    const productId = parseInt(element.dataset.productId, 0);
    const shoppingCart = getCookie('shoppingCart');
    const index = shoppingCart.findIndex(product => product.id === productId);

    shoppingCart.splice(index, 1);

    createCookie('shoppingCart', JSON.stringify(shoppingCart));
    element.parentElement.parentElement.remove();

    updateCartTotal(shoppingCart);
}

function updateCartTotal(shoppingCart) {
    if (shoppingCart) {
        let totalPrice = 0;
        let totalQuantity = 0;

        shoppingCart.forEach(function (product, i) {
            totalPrice += product.price * product.amount;
            totalQuantity += product.amount;
        });

        if (document.getElementById('shopping_cart_total_badge') !== undefined) {
            document.getElementById('shopping_cart_total_badge').innerHTML = totalQuantity;
        }

        if (document.getElementById('cart_total_price') !== undefined) {
            document.getElementById('cart_total_price').innerHTML = '€ ' + totalPrice;
        }
    }
}


async function order() {
    let shoppingCart = getCookie('shoppingCart')
    let surname = document.getElementById("surnameInput").value;
    let seatNumber = document.getElementById("seatInput").value;
    let cash = document.getElementById("payment_cash").value;
    let totalPrice = document.getElementById("cart_total_price").dataset.totalPrice;
    let body;

    if (isNaN(seatNumber)) {
        alert('Stoelnummer moet een nummer zijn!');
    }

    if (cash.checked) {
        body = {
            shoppingCart,
            totalPrice,
            user: {
                surname,
                seatNumber,
                paymentType: "cash"
            }
        }
    } else {
        body = {
            shoppingCart,
            totalPrice,
            user: {
                surname,
                seatNumber,
                paymentType: "creditcard"
            }
        }
    }

    createCookie('shoppingCart', JSON.stringify([]));
    updateShoppingCart();
    updateCartTotal([]);

    await fetch('/order/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

async function deleteOrder(orderId) {
    const orderRow = document.getElementById(orderId.toString());
    const orderChildRow = document.getElementById('child_' + orderId.toString());
    let body = {
        orderId: orderId
    }
    await fetch('/order/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).finally(function () {
        orderRow.remove();
        orderChildRow.remove();
    })
}

async function completeOrder(orderId) {
    const orderRow = document.getElementById(orderId.toString());
    const orderChildRow = document.getElementById('child_' + orderId.toString());

    let body = {
        orderId: orderId,
    }
    await fetch(window.location.href + '/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).finally(function () {
        orderRow.remove();
        orderChildRow.remove();
    });
}
