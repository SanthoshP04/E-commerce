const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

// Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456789",
      role: "admin",
    });

    // Assign the default user ID to each product
    const userID = createdUser._id;
    const sampleProducts = products.map((product) => ({
      ...product,
      user: userID,
    }));

    // Insert products into the database
    await Product.insertMany(sampleProducts);

    console.log("Product data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();


// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Product = require("./models/Product");
// const User = require("./models/User");
// const Cart = require("./models/Cart");

// const products = require("./data/products");


// dotenv.config();


// //Connect to moogoDB

// mongoose.connect(process.env.MONGO_URI)


// // functions to seed data

// const seedData = async () => {
//     try {


//         await Product.deleteMany();
//         await User.deleteMany();
//         await Cart.deleteMany();

//         //create deafult admin user 
//         const createdUser = await User.create({
//             name: "Admin User",
//             email: "admin@example.com",
//             password: "123456789",
//             role: "admin",
//         });


//         //assign the default user ID to each product

//         const userID = createdUser._id;

//         const sampleProducts = products.map((product) => {
//             return { ...product, user: userID };

//             //inser the product to the database


//         })

//         await Product.insertMany(sampleProducts);

//         console.log("Product data seeded successfully!");
//         process.exit();
//     } catch (error) {
//         console.error("Error seeding the data", error);
//         process.exit(1);


//     }
// };
// seedData();
