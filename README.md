# BAZARYO Application

Bazaryo is an e-commerce platform designed to facilitate buying and selling products. The application allows users to register, log in, manage their profiles, add products and categories, manage their cart, wish list, post reviews, and handle orders. Below is a detailed explanation of each API endpoint along with instructions on how to set up and run the application.

---

## 1. API Endpoints

### **Authentication**
- **POST** `/api/v1/Auth/register`  
  **Description:** Registers a new user.

- **POST** `/api/v1/Auth/login`  
  **Description:** Logs in a user with valid credentials.

- **POST** `/api/v1/Auth/password/forgot`  
  **Description:** Requests a password reset email.

- **POST** `/api/v1/Auth/password/verify-code`  
  **Description:** Verifies the password reset code.

- **POST** `/api/v1/Auth/password/reset`  
  **Description:** Resets the user's password using the verified code.

---

### **User**
- **POST** `/api/v1/User/me/profile`  
  **Description:** Retrieves the current user's profile.

- **POST** `/api/v1/User/me/activate`  
  **Description:** Activates the user's account.

- **POST** `/api/v1/User/me/profile/update-image`  
  **Description:** Updates the user's profile image.

- **GET** `/api/v1/User/me`  
  **Description:** Fetches data of the current user.

- **DELETE** `/api/v1/User/me/deactivate`  
  **Description:** Deactivates the user's account.

- **POST** `/api/v1/User/admin/changePassword/:id`  
  **Description:** Allows an admin to change the password of a specific user.

- **POST** `/api/v1/User/admin`  
  **Description:** Creates a new admin user.

- **GET** `/api/v1/User/admin/:id`  
  **Description:** Retrieves details of an admin user by ID.

- **DELETE** `/api/v1/User/admin/:id`  
  **Description:** Deletes an admin user.

- **PUT** `/api/v1/User/admin/:id`  
  **Description:** Updates information for an admin user.

---

### **Category**
- **POST** `/api/v1/Category`  
  **Description:** Creates a new category.

- **GET** `/api/v1/Category`  
  **Description:** Retrieves all categories.

- **GET** `/api/v1/Category/:id`  
  **Description:** Retrieves details of a category by ID.

- **PUT** `/api/v1/Category/update-Image-Category/:id`  
  **Description:** Updates the image for a category.

- **PUT** `/api/v1/Category/:id`  
  **Description:** Updates details of a category.

- **DELETE** `/api/v1/Category/:id`  
  **Description:** Deletes a specific category.

- **GET** `/api/v1/Category/:id/Products`  
  **Description:** Retrieves products associated with a specific category.

---

### **Product**
- **POST** `/api/v1/Product`  
  **Description:** Creates a new product.

- **GET** `/api/v1/Product`  
  **Description:** Retrieves all products.

- **GET** `/api/v1/Product/:id`  
  **Description:** Retrieves details of a product by ID.

- **PUT** `/api/v1/Product/update-Image-Product/:id`  
  **Description:** Updates the image of a product.

- **PUT** `/api/v1/Product/:id`  
  **Description:** Updates details of a product.

- **DELETE** `/api/v1/Product/:id`  
  **Description:** Deletes a specific product.

- **DELETE** `/api/v1/Product/admin/:id`  
  **Description:** Allows an admin to delete a product.

---

### **Wishlist**
- **POST** `/api/v1/Wishlist/:ProductId`  
  **Description:** Adds a product to the user's wishlist.

- **DELETE** `/api/v1/Wishlist/:ProductId`  
  **Description:** Removes a product from the user's wishlist.

- **GET** `/api/v1/Wishlist/`  
  **Description:** Retrieves all products in the user's wishlist.

---

### **Cart**
- **POST** `/api/v1/Cart/:ProductId`  
  **Description:** Adds a product to the user's cart.

- **GET** `/api/v1/Cart/`  
  **Description:** Retrieves all items in the user's cart.

- **PUT** `/api/v1/Cart/clear`  
  **Description:** Clears the entire cart.

- **DELETE** `/api/v1/Cart/:ProductId`  
  **Description:** Removes a specific product from the cart.

---

### **Review**
- **POST** `/api/v1/Review/:productId`  
  **Description:** Adds a review for a specific product.

- **GET** `/api/v1/Review/:productId`  
  **Description:** Retrieves all reviews for a specific product.

- **PUT** `/api/v1/Review/:reviewId`  
  **Description:** Updates an existing review.

- **DELETE** `/api/v1/Review/:reviewId`  
  **Description:** Deletes a specific review.

---

### **Order**
- **POST** `/api/v1/order`  
  **Description:** Places a new order.

- **GET** `/api/v1/Order/:orderId`  
  **Description:** Retrieves details of an order by ID.

- **GET** `/api/v1/Order/total`  
  **Description:** Retrieves the total value of orders for the user.

- **GET** `/api/v1/Order/:userId`  
  **Description:** Retrieves all orders placed by a specific user.

- **GET** `/api/v1/Order/Product/:productId/count`  
  **Description:** Retrieves the count of orders for a specific product.

- **GET** `/api/v1/Order/status/:status`  
  **Description:** Retrieves orders filtered by status (e.g., paid, shipped, cancelled).

- **GET** `/api/v1/user/:userId/status/:status`  
  **Description:** Retrieves orders for a specific user filtered by status.

- **DELETE** `/api/v1/Order/:orderId`  
  **Description:** Deletes a specific order.

- **PUT** `/api/v1/Order/:orderId/Paid`  
  **Description:** Updates an order's status to "Paid".

- **PUT** `/api/v1/Order/:orderId/Shipped`  
  **Description:** Updates an order's status to "Shipped".

- **PUT** `/api/v1/Order/:orderId/Delivered`  
  **Description:** Updates an order's status to "Delivered".

- **DELETE** `/api/v1/Order/:orderId/Cancelled`  
  **Description:** Cancels an order.

---

## 2. How to Set Up and Run the Application

### **Prerequisites:**
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (Ensure you have the appropriate version installed)
- [Express.js](https://expressjs.com/) (Ensure you have the appropriate version installed)
- [Mongodb](https://www.mongodb.com/) (Ensure you have the appropriate version installed)
- Git
- Github

# 🚀 Steps to Run the API

### 1. Clone the Repository
First, download the project files by cloning the repository:
```bash
git clone https://github.com/AbdelrahmanMahmmed/Bazaryo
```

### 2. Open the Project in Visual Studio Code
1. Launch **VS Code**.
2. Click on **File > Open Folder**.
3. Navigate to the project directory and select it.

### 3. Install Dependencies
Open the integrated terminal in **VS Code**:
- Use the shortcut **Ctrl + `** or go to **Terminal > New Terminal**.
- Run the following command to install the required packages:
  ```bash
  npm install
  ```

### 4. Set Up Environment Variables
Create a config.env` file in the root of the project and configure the following variables:
```
MONGO_URI

COOKIE_EXPIRES_TIME
JWT_SECRET_KEY
JWT_EXPIRES_TIME
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
AUTH_USER_SEND_EMAIL
AUTH_PASSWORD_SEND_EMAIL
AUTH_HAST_SEND_EMAIL
AUTH_PORT_SEND_EMAIL
```

### 5. Start the Server
Run the following command to start the API server:
```bash
npm start
```

For development mode with live reload:
```bash
npm run dev
```

The server will now be running at `http://localhost:8000`.

### 6. Test the API
Use tools like **Postman** or **cURL** to test the endpoints. For detailed API usage, refer to the [Postman Documentation](https://documenter.getpostman.com/view/39841782/2sAYX6ng79).
---

## 🎉 You're All Set!
You can now explore and enhance the BAZARYO API as per your requirements. Happy coding! 🚀
