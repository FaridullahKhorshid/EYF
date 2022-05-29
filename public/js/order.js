let moment = require('moment');

export function parseOrders(orders) {
    // Hacky way to extract relevant data
    // Since raw doesn't work with eager loading
    // So we have to manually parse the data
    let parsedOrders = [];
    orders.forEach(function(order, i) {
        let order_products = order.dataValues.order_products;
        let orderLine = {
            order: order.dataValues,
            products: []
        }
        order_products.forEach(function(order_product, i) {
            let products = order_product.product.dataValues;
            orderLine.products.push(products);
        })
        parsedOrders.push(orderLine);
    });
    return parsedOrders;
}

export function formatDate(date) {
    return moment(date).format('DD-MM-YYYY hh:mm')
}
