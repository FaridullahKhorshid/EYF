import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import sassMiddleware from 'node-sass-middleware';
import session from 'express-session';

// pages
import indexRouter from './routes/index';
import chatRouter from './routes/chat';
import userRouter from './routes/user'
import shopRouter from './routes/shop';
import voucherRouter from './routes/voucher';
import musicRouter from './routes/music';
import filmRouter from './routes/film';
import flightRouter from './routes/flight_info';
import adminRouter from './routes/admin';
import orderRouter from './routes/order';
import gameRouter from './routes/game';

const logger = require('morgan');

const cors = require("cors");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let corsOptions = {
    origin: "http://localhost:8081"
}

// Define app
let app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: true,
    cookie: { maxAge: 8*60*60*1000 },  // 8 hours
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.user = req.session.userName;
    next();
});

const isLoggedIn = function (req, res, next) {
    req.session.loggedIn = req.loggedIn === true;
    next()
}

const checkShoppingCart = function (req, res, next) {
    const shoppingCart = req.cookies['shoppingCart'];

    if (shoppingCart === undefined) {
        req.shoppingCart = {products: [], totalPrice: 0};
    } else {
        const products = JSON.parse(shoppingCart);
        let totalPrice = 0;
        let totalQuantity = 0;
        products.forEach(function (product, i) {
            totalPrice += product.amount * product.price;
            totalQuantity += product.amount;
        });

        req.shoppingCart = {
            products: products,
            totalPrice: totalPrice,
            totalQuantity: totalQuantity
        };
    }
    next();
}

app.use(checkShoppingCart);
app.use(isLoggedIn);

// use the routers
app.use('/', indexRouter);
app.use('/chat', chatRouter);
app.use('/shop', shopRouter);
app.use('/voucher', voucherRouter);
app.use('/music', musicRouter);
app.use('/film', filmRouter);
app.use('/user', userRouter);
app.use('/flight_info', flightRouter);
app.use('/admin', adminRouter);
app.use('/order', orderRouter);
app.use('/game', gameRouter);

// Include stylesheets and js
app.use("/css", express.static(path.join(__dirname, 'node_modules/mdb-ui-kit/css')));
app.use("/js", express.static(path.join(__dirname, 'node_modules/mdb-ui-kit/js')));
app.use("/icon", express.static(path.join(__dirname, 'node_modules/material-icons/iconfont')));
app.use("/swiper", express.static(path.join(__dirname, 'node_modules/swiper')));
app.use("/socket", express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));
app.use("/usb", express.static('E:/eyf/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

let db = require('./models');

db.sequelize.sync().then(r => console.log('DB works'));
module.exports = app;
