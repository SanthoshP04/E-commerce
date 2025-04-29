import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Helper function to get current token
const getAuthHeader = () => {
  return { Authorization: `Bearer ${localStorage.getItem("userToken")}` };
};

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async function to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/products`,
        productData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/products/${id}`,
        productData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete an existing product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: getAuthHeader(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
    operationLoading: false,
    operationError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export default adminProductSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";


// const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`
// const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
// //async thunk to fetch admin products

// export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", async () => {
//     const response = await axios.get(`${API_URL}/api/admin/products`, {
//         headers: {
//             Authorization: USER_TOKEN
//         }

//     })
//     return response.data;
// })


// //async function to create a new product
// export const createProduct = createAsyncThunk("adminProducts/createProduct",
//     async (productData) => {
//         const response = await axios.post(
//             `${API_URL}/api/admin/products`,
//             productData,
//             {
//                 headers: {
//                     Authorization: USER_TOKEN,
//                 },
//             }
//         );
//         return response.data;

//     }
// )



// //async thunk to update an existing product

// export const updateProduct = createAsyncThunk("adminProducts/updateProduct",
//     async ({ id, productData }) => {
//         const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData,
//             {
//                 headers: {
//                     Authorization: USER_TOKEN,
//                 }
//             }
//         )
//         return response.data;
//     }
// )

// //async thunk to updeate an existing product
// export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct",
//     async (id) => {
//         await axios.delete(`${API_URL}/api/admin/products/${id}`, {

//         });
//         return id;
//     }
// )

// const adminProductSlice = createSlice({
//     name: "adminProducts",
//     initialState: {
//         products: [],
//         loading: false,
//         error: null,

//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchAdminProducts.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchAdminProducts.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.products = action.payload;
//             })
//             .addCase(fetchAdminProducts.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;

//             })
//             //Create Product

//             .addCase(createProduct.fulfilled, (state, action) => {
//                 state.products.push(action.payload);
//             })

//             //update product
//             .addCase(updateProduct.fulfilled, (state, action) => {
//                 const index = state.products.findIndex(
//                     (product) => product._id === action.payload._id
//                 )

//                 if (index !== -1) {
//                     state.products[index] = action.payload;
//                 }
//             })

//             //Delete Product
//             .addCase(deleteProduct.fulfilled, (state, action) => {
//                 state.products = state.products.filter(
//                     (product) => product._id !== action.payload
//                 )
//             })
//     }
// });

// export default adminProductSlice.reducer;