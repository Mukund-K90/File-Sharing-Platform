const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { connectDb } = require('./src/config/db');
const { request } = require('http');
app.use(cookieParser());
const { initializePlans } = require('./src/utils/initials');



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

// Setup EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//set cookie session for flash messages
app.use(cookieParser('NotSoSecret'));
app.use(session({
    secret: 'something',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

//connect db
connectDb();
//initials plans data 
initializePlans();


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


const viewsRoutes = require('./src/routes/common/viewsRoutes');
app.use('/', viewsRoutes);

const fileUploadRoutes = require('./src/routes/user/fileUploadRoutes');
app.use('/file', fileUploadRoutes);

const paymentRoutes = require('./src/routes/user/paymentRoutes');
app.use('/payment', paymentRoutes);

//user routes
const userRoutes = require('./src/routes/user/userRoutes');
const { CONFIG } = require('./src/config/config');
app.use('/v1/user', userRoutes);





// Starting server
const PORT = 9090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${CONFIG.baseUrl}${PORT}`);
});
