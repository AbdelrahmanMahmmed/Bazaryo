const express = require('express');
const app = express();
const dotenv = require("dotenv");
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Load env variables
dotenv.config({ path: 'config.env' })
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Error Handler
const ApiError = require('./utils/APIError.js');
const globalError = require('./middleware/errormiddleware.js');


// Middleware
app.use(express.json());
app.use(morgan("dev"));
    


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
const DBconnection = require('./config/dbConnection.js');
DBconnection();

// Starter App
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Bazaryo API' });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Router
app.use('/api/v1/Auth', AuthRouter);
app.use('/api/v1/User', UserRouter);
app.use('/api/v1/Product', ProductRouter);
app.use('/api/v1/Category', CategoryRouter);
app.use('/api/v1/Wishlist', WshlistRouter);
app.use('/api/v1/Cart', CartRouter);
app.use('/api/v1/Review', ReviewRouter);
app.use('/api/v1/Order', OrderRouter);
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

module.exports = app ;