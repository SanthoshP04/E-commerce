import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to clean filter values before sending to API
const cleanFilterValue = (value) => {
  // Handle various false-y values consistently
  if (value === undefined || value === null || value === '') return null;
  return value;
};

// Async Thunk to Fetch Products by Filters
export const fetchProductsByFilters = createAsyncThunk(
  'products/fetchByFilter',
  async (filters, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      
      // Destructure filter properties with defaults
      const {
        collection = null,
        size = null,
        color = null,
        gender = null,
        minPrice = null,
        maxPrice = null,
        sortBy = null,
        search = null,
        category = null,
        material = null,
        brand = null,
        limit = null,
      } = filters || {};

      // Only add parameters that have actual values
      if (cleanFilterValue(collection)) query.append('collection', collection);
      if (cleanFilterValue(size)) query.append('size', size);
      if (cleanFilterValue(color)) query.append('color', color);
      if (cleanFilterValue(gender)) query.append('gender', gender);
      if (cleanFilterValue(minPrice) !== null && !isNaN(minPrice)) query.append('minPrice', minPrice);
      if (cleanFilterValue(maxPrice) !== null && !isNaN(maxPrice)) query.append('maxPrice', maxPrice);
      if (cleanFilterValue(sortBy)) query.append('sortBy', sortBy);
      if (cleanFilterValue(search)) query.append('search', search);
      if (cleanFilterValue(category)) query.append('category', category);
      if (cleanFilterValue(material)) query.append('material', material);
      if (cleanFilterValue(brand)) query.append('brand', brand);
      if (cleanFilterValue(limit)) query.append('limit', limit);

      const queryString = query.toString();
      console.log('Fetching products with query:', queryString);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?${queryString}`
      );
      
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch products error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

// Rest of the thunks remain the same
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product details'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilarProducts',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch similar products'
      );
    }
  }
);

export const fetchProductAttributes = createAsyncThunk(
  'products/fetchProductAttributes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/attributes`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product attributes'
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    attributes: {
      categories: [],
      sizes: [],
      colors: [],
      genders: [],
      brands: [],
      materials: [],
      collections: [],
      priceRange: { min: 0, max: 1000 }
    },
    filters: {
      category: '',
      size: '',
      color: '',
      gender: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
      material: '',
      collection: '',
      search: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      // Update only the specified filters, keeping others intact
      state.filters = { ...state.filters, ...action.payload };
      console.log('Updated filters:', state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        size: '',
        color: '',
        gender: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        sortBy: '',
        material: '',
        collection: '',
        search: '',
      };
    },
    resetSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    extractFiltersFromProducts: (state) => {
      if (state.products.length === 0) return;
      
      // Extract unique values for each attribute
      const categories = new Set();
      const sizes = new Set();
      const colors = new Set();
      const genders = new Set();
      const brands = new Set();
      const materials = new Set();
      const collections = new Set();
      let minPrice = Infinity;
      let maxPrice = 0;
      
      state.products.forEach(product => {
        if (product.category) categories.add(product.category);
        
        // Handle sizes as either array or string
        if (product.sizes && Array.isArray(product.sizes)) {
          product.sizes.forEach(size => sizes.add(size));
        } else if (product.size) {
          sizes.add(product.size);
        }
        
        // Handle colors as either array or string
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach(color => colors.add(color));
        } else if (product.color) {
          colors.add(product.color);
        }
        
        if (product.gender) genders.add(product.gender);
        
        // Handle brand as either array or string
        if (product.brands && Array.isArray(product.brands)) {
          product.brands.forEach(brand => brands.add(brand));
        } else if (product.brand) {
          brands.add(product.brand);
        }
        
        // Handle material as either array or string
        if (product.materials && Array.isArray(product.materials)) {
          product.materials.forEach(material => materials.add(material));
        } else if (product.material) {
          materials.add(product.material);
        }
        
        if (product.collection) collections.add(product.collection);
        
        if (product.price && !isNaN(product.price)) {
          minPrice = Math.min(minPrice, Number(product.price));
          maxPrice = Math.max(maxPrice, Number(product.price));
        }
      });
      
      // Update attributes in state
      state.attributes = {
        categories: Array.from(categories),
        sizes: Array.from(sizes),
        colors: Array.from(colors),
        genders: Array.from(genders),
        brands: Array.from(brands),
        materials: Array.from(materials),
        collections: Array.from(collections),
        priceRange: { 
          min: minPrice !== Infinity ? minPrice : 0, 
          max: maxPrice > 0 ? maxPrice : 1000 
        }
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        
        // Only set error if specifically no products found
        if (Array.isArray(action.payload) && action.payload.length === 0) {
          state.error = 'No products found';
        } else {
          state.error = null;
        }
        
        // Extract filters from products if attributes API isn't available
        if (state.attributes.categories.length === 0) {
          // Only run if attributes haven't been loaded
          const tempState = JSON.parse(JSON.stringify(state));
          productsSlice.caseReducers.extractFiltersFromProducts(tempState);
          state.attributes = tempState.attributes;
        }
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        // Don't clear products on error to maintain a better UX
      })
      // The rest of the extra reducers remain the same
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchProductAttributes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductAttributes.fulfilled, (state, action) => {
        state.loading = false;
        state.attributes = action.payload;
      })
      .addCase(fetchProductAttributes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setFilters, clearFilters, resetSelectedProduct, extractFiltersFromProducts } =
  productsSlice.actions;
export default productsSlice.reducer;
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // // Async Thunk to Fetch Products by Filters
// // export const fetchProductsByFilters = createAsyncThunk(
// //     "products/fetchByFilter",
// //     async ({
// //         collection,
// //         size,
// //         color,
// //         gender,
// //         minPrice,
// //         maxPrice,
// //         sortBy,
// //         search,
// //         category,
// //         material,
// //         brand,
// //         limit,
// //     }) => {
// //         const query = new URLSearchParams();

// //         // Append each filter parameter if it exists
// //         if (collection) query.append("collection", collection);
// //         if (size) query.append("size", size);
// //         if (color) query.append("color", color);
// //         if (gender) query.append("gender", gender);
// //         if (minPrice) query.append("minPrice", minPrice);
// //         if (maxPrice) query.append("maxPrice", maxPrice);
// //         if (sortBy) query.append("sortBy", sortBy);
// //         if (search) query.append("search", search);
// //         if (category) query.append("category", category);
// //         if (material) query.append("material", material);
// //         if (brand) query.append("brand", brand);
// //         if (limit) query.append("limit", limit);

// //         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
// //         );
// //         return response.data;
// //     });

// // //async thunk to fetch a single product by Id

// // export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails",
// //     async (id) => {
// //         const response = await axios.get(
// //             ` ${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
// //         );
// //         return response.data;

// //     }
// // );



// // export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, productData }) => {
// //     const response = await axios.put(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, productData,
// //         {
// //             headers: {
// //                 Authorization: `Bearer ${localStorage.getItem("userToken")}`,
// //             }
// //         }
// //     );
// //     return response.data;

// // })


// // //Async thunk to fetch similar products


// // export const fetchSimilarProducts = createAsyncThunk(
// //     "products/fetchSimilarProducts",
// //     async ({ id }) => {
// //         const response = await axios.get(
// //             `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
// //         )
// //         return response.data;
// //     }
// // )

// // const productsSlice = createSlice({
// //     name: "products",
// //     initialState: {
// //         products: [],
// //         selectedProduct: null,//store the details of the single products

// //         similarProducts: [],
// //         loading: false,
// //         error: null,
// //         filters: {
// //             category: "",
// //             size: "",
// //             color: "",
// //             gender: "",
// //             brand: "",
// //             minPrice: "",
// //             sortBy: "",
// //             material: "",
// //             collection: "",

// //         },

// //     },
// //     reducers: {
// //         setFilters: (state, action) => {
// //             state.filters = { ...state.filters, ...action.payload };
// //         },
// //         clearFilters: (state) => {
// //             state.filters = {
// //                 category: "",
// //                 size: "",
// //                 color: "",
// //                 gender: "",
// //                 brand: "",
// //                 minPrice: "",
// //                 sortBy: "",
// //                 material: "",
// //                 collection: "",
// //             }
// //         }
// //     },
// //     extraReducers: (builder) => {
// //         builder

// //             //handel fetching products by filters
// //             .addCase(fetchProductsByFilters.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.products = Array.isArray(action.payload) ? action.payload : [];
// //             })

// //             .addCase(fetchProductsByFilters.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message;
// //             })
// //             //handel fetching product details

// //             .addCase(fetchProductDetails.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchProductDetails.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.selectedProduct = action.payload;
// //             })

// //             .addCase(fetchProductDetails.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message;
// //             })

// //             //handel update products

// //             .addCase(updateProduct.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(updateProduct.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 const updateProduct = action.payload;

// //                 const index = state.products.findIndex(
// //                     (product) => product._id === updateProduct._id
// //                 );
// //                 if (index !== -1) {
// //                     state.products[index] = updateProduct;
// //                 }
// //             })

// //             .addCase(updateProduct.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message;
// //             })

// //             //similar products

// //             .addCase(fetchProductDetails.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchProductDetails.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.selectedProduct = action.payload;
// //             })

// //             .addCase(fetchProductDetails.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message;
// //             })

// //     }
// // })

// // export const {setFilters,clearFilters}=productsSlice.actions;
// // export default productsSlice.reducer;




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// // Async Thunk to Fetch Products by Filters
// export const fetchProductsByFilters = createAsyncThunk(
//     "products/fetchByFilter",
//     async ({
//         collection,
//         size,
//         color,
//         gender,
//         minPrice,
//         maxPrice,
//         sortBy,
//         search,
//         category,
//         material,
//         brand,
//         limit,
//     }) => {
//         const query = new URLSearchParams();

//         // Append each filter parameter if it exists
//         if (collection) query.append("collection", collection);
//         if (size) query.append("size", size);
//         if (color) query.append("color", color);
//         if (gender) query.append("gender", gender);
//         if (minPrice) query.append("minPrice", minPrice);
//         if (maxPrice) query.append("maxPrice", maxPrice);
//         if (sortBy) query.append("sortBy", sortBy);
//         if (search) query.append("search", search);
//         if (category) query.append("category", category);
//         if (material) query.append("material", material);
//         if (brand) query.append("brand", brand);
//         if (limit) query.append("limit", limit);

//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
//         );
//         return response.data;
//     }
// );

// // Async thunk to fetch a single product by Id
// export const fetchProductDetails = createAsyncThunk(
//     "products/fetchProductDetails",
//     async (id) => {
//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
//         );
//         return response.data;
//     }
// );

// export const updateProduct = createAsyncThunk(
//     "products/updateProduct",
//     async ({ id, productData }) => {
//         const response = await axios.put(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
//             productData,
//             {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//                 }
//             }
//         );
//         return response.data;
//     }
// );

// // Async thunk to fetch similar products
// export const fetchSimilarProducts = createAsyncThunk(
//     "products/fetchSimilarProducts",
//     async (id) => {  // Changed from ({ id }) to (id) for consistency
//         const response = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
//         );
//         return response.data;
//     }
// );

// const productsSlice = createSlice({
//     name: "products",
//     initialState: {
//         products: [],
//         selectedProduct: null, // store the details of the single product
//         similarProducts: [],
//         loading: false,
//         error: null,
//         filters: {
//             category: "",
//             size: "",
//             color: "",
//             gender: "",
//             brand: "",
//             minPrice: "",
//             maxPrice: "",  // Added missing maxPrice
//             sortBy: "",
//             material: "",
//             collection: "",
//         },
//     },
//     reducers: {
//         setFilters: (state, action) => {
//             state.filters = { ...state.filters, ...action.payload };
//         },
//         clearFilters: (state) => {
//             state.filters = {
//                 category: "",
//                 size: "",
//                 color: "",
//                 gender: "",
//                 brand: "",
//                 minPrice: "",
//                 maxPrice: "",  // Added missing maxPrice
//                 sortBy: "",
//                 material: "",
//                 collection: "",
//             };
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Handle fetching products by filters
//             .addCase(fetchProductsByFilters.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.products = Array.isArray(action.payload) ? action.payload : [];
//             })
//             .addCase(fetchProductsByFilters.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })

//             // Handle fetching product details
//             .addCase(fetchProductDetails.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProductDetails.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.selectedProduct = action.payload;
//             })
//             .addCase(fetchProductDetails.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })

//             // Handle update products
//             .addCase(updateProduct.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updateProduct.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const updatedProduct = action.payload;  // Fixed variable name (was updateProduct)
//                 const index = state.products.findIndex(
//                     (product) => product._id === updatedProduct._id
//                 );
//                 if (index !== -1) {
//                     state.products[index] = updatedProduct;
//                 }
//             })
//             .addCase(updateProduct.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })

//             // Handle similar products (you had duplicate fetchProductDetails cases here)
//             .addCase(fetchSimilarProducts.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.similarProducts = action.payload;
//             })
//             .addCase(fetchSimilarProducts.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             });
//     }
// });

// export const { setFilters, clearFilters } = productsSlice.actions;
// export default productsSlice.reducer;