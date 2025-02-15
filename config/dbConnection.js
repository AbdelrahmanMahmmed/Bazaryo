const mongoose = require('mongoose');

// Connect to MongoDB

const conn = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then((connect) => 
            { 
                console.log("Database connect.....") 
            })
            .catch((err) => 
                { 
                console.log(err) 
        }   
    );
} 

module.exports = conn;
