import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { params: { userId, guestId } }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, image, name, price, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, size, color, image, name, price, guestId, userId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        guestId,
        userId,
        size,
        color,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data: { productId, guestId, userId, size, color },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update cart item image
export const updateCartItemImage = createAsyncThunk(
  "cart/updateCartItemImage",
  async ({ productId, image, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/image`, {
        productId,
        image,
        guestId,
        userId,
        size,
        color,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
    // Local-only image update for offline functionality
    updateProductImage: (state, action) => {
      const { productId, size, color, image } = action.payload;
      const productIndex = state.cart.products.findIndex(
        (item) => 
          item.productId === productId && 
          item.size === size && 
          item.color === color
      );
      
      if (productIndex !== -1) {
        state.cart.products[productIndex].image = image;
        saveCartToStorage(state.cart);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateCartItemImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemImage.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, updateProductImage } = cartSlice.actions;
export default cartSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Helper function to load cart from localStorage
// const loadCartFromStorage = () => {
//     const storedCart = localStorage.getItem("cart");
//     return storedCart ? JSON.parse(storedCart) : { products: [] };
// };

// // Helper function to save cart to localStorage
// const saveCartToStorage = (cart) => {
//     localStorage.setItem("cart", JSON.stringify(cart));
// };

// // Fetch cart for a user or guest
// export const fetchCart = createAsyncThunk(
//     "cart/fetchCart",
//     async ({ userId, guestId }, { rejectWithValue }) => {
//         try {
//             const response = await axios.get(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
//                 { params: { userId, guestId } }
//             );
//             return response.data;
//         } catch (error) {
//             console.error(error);
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

// // Add an item to the cart for a user or guest
// export const addToCart = createAsyncThunk(
//     "cart/addToCart",
//     async (
//         { productId, quantity, size, color, guestId, userId },
//         { rejectWithValue }
//     ) => {
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
//                 { productId, quantity, size, color, guestId, userId }
//             );
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );
// //update the quantity of an item in the cart

// export const updateCartItemQuantity = createAsyncThunk(
//     "cart/updateCartItemQuantity", async ({ productId, quantity, guestId, userId, size, color },
//         { rejectWithValue }
//     ) => {
//     try {
//         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
//             productId,
//             quantity,
//             guestId,
//             userId,
//             size,
//             color,
//         });
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data)
//     }
// }
// );

// //remove item from the cart
// export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
//     try {
//         const response = await axios({
//             method: "DELETE",
//             url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
//             data: { productId, guestId, userId, size, color },
//         });
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }
// })


//     //merge guset cart info user cart

//     export const mergeCart= createAsyncThunk("cart/mergeCart",async({guestId,user},{rejectWithValue})=>{
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
//                 {guestId,user},
//                 {
//                     headers:{
//                         Authorization:`Bearer ${localStorage.getItem("userToken")}`,
//                     }
//                 }
//             );
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     })

//     const cartSlice = createSlice({
//         name:"cart",
//         initialState:{
//             cart:loadCartFromStorage(),
//             loading:false,
//             error:null,
//         },
//         reducers:{
//             clearCart:(state)=>{
//                 state.cart= {products:[]};
//                 localStorage.removeItem("cart");
//             },
//         },
//         extraReducers:(builder)=>{
//             builder
//             .addCase(fetchCart.pending, (state) => {
//               state.loading = true;
//               state.error = null;
//             })
//             .addCase(fetchCart.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.error = null;
//                 state.cart = action.payload; // ✅ Store data in state.cart
//                 saveCartToStorage(action.payload); // ✅ Sync with localStorage
//               })
//             .addCase(addToCart.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//               })
//               .addCase(addToCart.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.cart = action.payload; // Update cart with new data
//               })
//               .addCase(addToCart.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload || 'Failed to add item to cart';
//               state.error = action.payload?.message || "Failed to add to cart";
//             })

//             .addCase(updateCartItemQuantity.pending,(state)=>{
//                 state.loading=true;
//                 state.error = null;
//             })
//             .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.cart = action.payload; // FIXED HERE
//                 saveCartToStorage(action.payload);
              
//             })
//             .addCase(updateCartItemQuantity.rejected,(state,action)=>{
//                 state.loading=false;
//                 state.error = action.payload?.message || "Failed to update item quantity";
//             })

//             .addCase(removeFromCart.pending,(state)=>{
//                 state.loading=true;
//                 state.error = null;
//             })
//             .addCase(removeFromCart.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.cart = action.payload; // ✅ fix here
//                 saveCartToStorage(action.payload);
//               })
//             .addCase(removeFromCart.rejected,(state,action)=>{
//                 state.loading=false;
//                 state.error = action.payload?.message || "Failed to remove item";
//             })
//             .addCase(mergeCart.pending,(state)=>{
//                 state.loading=true;
//                 state.error = null;
//             })
//             .addCase(mergeCart.fulfilled,(state,action)=>{
//                 state.loading=false;
//                 state.error = action.payload;
//                 saveCartToStorage(action.payload);
//             })
//             .addCase(mergeCart.rejected,(state,action)=>{
//                 state.loading=false;
//                 state.error = action.payload?.message || "Failed to merge cart";
//             })


//         }
//     });


//     export const {clearCart} = cartSlice.actions;
//     export default cartSlice.reducer;
