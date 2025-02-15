const express = require('express');
const app = express();
const dotenv = require("dotenv");
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const PORT = process.env.PORT || 8000;

// Load env variables
dotenv.config({ path: 'config.env' })
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Error Handler
const ApiError = require('./utils/APIError.js');
const globalError = require('./middleware/errormiddleware.js');


// Middleware
app.use(express.json());
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
    console.log(process.env.NODE_ENV);
}

// SSL Certificate
const privateKey = fs.readFileSync('ssl/private.key', 'utf8');
const certificate = fs.readFileSync('ssl/certificate.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

// Enable CORS
app.use(cors());

// Import Routes
const AuthRouter = require('./routers/AuthRouter');
const UserRouter = require('./routers/UserRouter');
const ProductRouter = require('./routers/ProductRouter');
const CategoryRouter = require('./routers/CategoryRouter');
const WshlistRouter = require('./routers/WshlistRouter.js');
const CartRouter = require('./routers/CartRouter.js');
const ReviewRouter = require('./routers/ReviewRouter.js');
const OrderRouter = require('./routers/OrderRouter.js');


// Connection to DataBase
const DBconnection = require('./config/dbconnection');
DBconnection();

// Starter App
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Bazaryo API' });
});

// Swagger Documentation

// Router
app.use('/api/v1/Auth', AuthRouter);
app.use('/api/v1/User', UserRouter);
app.use('/api/v1/Product', ProductRouter);
app.use('/api/v1/Category', CategoryRouter);
app.use('/api/v1/Wishlist', WshlistRouter);
app.use('/api/v1/Cart', CartRouter);
app.use('/api/v1/Review', ReviewRouter);
app.use('/api/v1/Order', OrderRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Error handling middleware on Express
app.all('*', (req, res, next) => {
    next(new ApiError(`This is the err No route ${req.originalUrl}`, 400));
});

// Error handling middleware globally  (it will be called in case of any error)
app.use(globalError);

// Start server  (app.listen)
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});

// Unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server(() => {
        process.exit(1);
    })
});