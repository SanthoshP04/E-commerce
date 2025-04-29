import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  fetchProductDetails,
  updateProduct,
} from '../../redux/slices/productsSlice';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    sku: '',
    category: '',
    brand: '',
    sizes: [],
    colors: [],
    materials: '',
    gender: '',
    images: [{ url: 'https://picsum.photos/150?random=111' }],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value === '' ? '' : Number(value),
    }));
  };

  const handleArrayChange = (e, field) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: e.target.value.split(',').map((item) => item.trim()),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await axios.post(
       ` ${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: '' }],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate('/admin/products');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
      <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Product Name</label>
          <input
            type='text'
            name='name'
            value={productData.name}
            onChange={handleChange}
            className='w-full border border-gray-500 rounded-md p-2'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Description</label>
          <textarea
            name='description'
            value={productData.description}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
            rows={4}
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Price</label>
          <input
            type='number'
            name='price'
            value={productData.price}
            onChange={handleNumberChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Count in Stock</label>
          <input
            type='number'
            name='countInStock'
            value={productData.countInStock}
            onChange={handleNumberChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>SKU</label>
          <input
            type='text'
            name='sku'
            value={productData.sku}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
          <input
            type='text'
            value={productData.sizes.join(', ')}
            onChange={(e) => handleArrayChange(e, 'sizes')}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Colors (comma-separated)</label>
          <input
            type='text'
            value={productData.colors.join(', ')}
            onChange={(e) => handleArrayChange(e, 'colors')}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Upload Images</label>
          <input type='file' accept='image/*' onChange={handleImageUpload} />
          {uploading && <p className='text-sm text-blue-500 mt-2'>Uploading image...</p>}
          <div className='flex gap-4 mt-4 flex-wrap'>
            {productData.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt='Product'
                className='w-20 h-20 object-cover rounded-md shadow-md'
              />
            ))}
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage; 
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchProductDetails } from '../../redux/slices/productsSlice';
// import axios from 'axios';
// import { updateProduct } from '../../redux/slices/adminProductSlice';
// const EditProductPage = () => {

//     const dispatch = useDispatch()
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const { selectedProducts, loading, error } = useSelector((state) => state.products);
//     const [productData, setProductData] = useState({
//         name: "",
//         description: "",
//         price: "",
//         countInStock: "",
//         sku: "",
//         category: "",
//         brand: "",
//         sizes: [],
//         colors: [],
//         materials: "",
//         gender: "",
//         images: [
//             { url: "https://picsum.photos/150?random=111" },

//         ],
//     });

//     const [uploading, setUploading] = useState(false);//image upload state

//     useEffect(() => {
//         if (id) {
//             dispatch(fetchProductDetails(id));
//         }
//     }, [dispatch, id])
//     useEffect(()=>{
//         if(selectedProducts){
//             setProductData(selectedProducts);
//         }
//     },[selectedProducts]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProductData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleNumberChange = (e) => {
//         const { name, value } = e.target;
//         setProductData((prevData) => ({
//             ...prevData,
//             [name]: value === "" ? "" : Number(value),
//         }));
//     };

//     const handleArrayChange = (e, field) => {
//         setProductData((prevData) => ({
//             ...prevData,
//             [field]: e.target.value.split(",").map((item) => item.trim()),
//         }));
//     };

//     const handeImageUpload =async (e) => {
//  const file = e.target.files[0];
//  const formData = new formData();
//  formData.append("image",file);
 
//  try {
//     setUploading(true);
//     const {data}= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
//         formData,{
//             headers:{"Content-Type":"multipart/form-data"},
//         }
//     )
//     setProductData((prevData)=>({
//         ...prevData,
//         images:[...prevData.images,{url: data.imageUrl,altText:""}],
//     }))
//     setUploading(false)
//  } catch (error) {
//     console.error(error);
//     console.log(productData);
//  }
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(updateProduct({id,productData}))
//         navigate("/admin/products");
//     };
//     if(loading) return <p>Loading...</p>
//     if(error) return <p>Error:{error}</p>

//     return (
//         <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
//             <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className='mb-6'>
//                     <label className="block font-semibold mb-2">Product Name</label>
//                     <input type="text" name='name' value={productData.name} onChange={handleChange} className='w-full border border-gray-500 rounded-md p-2' required />
//                 </div>

//                 <div className='mb-6'>
//                     <label className="block font-semibold mb-2">Description</label>
//                     <textarea name="description" value={productData.description} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' rows={4} required />
//                 </div>

//                 <div className="mb-6">
//                     <label className='block font-semibold mb-2'>Price</label>
//                     <input type="number" name='price' value={productData.price} onChange={handleNumberChange} className='w-full border border-gray-300 rounded-md p-2' />
//                 </div>

//                 <div className="mb-6">
//                     <label className='block font-semibold mb-2'>Count in Stock</label>
//                     <input type="number" name='countInStock' value={productData.countInStock} onChange={handleNumberChange} className='w-full border border-gray-300 rounded-md p-2' />
//                 </div>

//                 <div className="mb-6">
//                     <label className='block font-semibold mb-2'>SKU</label>
//                     <input type="text" name='sku' value={productData.sku} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' />
//                 </div>

//                 <div className="mb-6">
//                     <label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
//                     <input type="text" name='sizes' value={productData.sizes.join(", ")} onChange={(e) => handleArrayChange(e, 'sizes')} className='w-full border border-gray-300 rounded-md p-2' />
//                 </div>

//                 <div className="mb-6">
//                     <label className='block font-semibold mb-2'>Colors (comma-separated)</label>
//                     <input type="text" name='colors' value={productData.colors.join(", ")} onChange={(e) => handleArrayChange(e, 'colors')} className='w-full border border-gray-300 rounded-md p-2' />
//                 </div>

//                 <div className='mb-6'>
//                     <label className='block font-semibold mb-2'>Upload Images</label>
//                     <input type="file" accept='image/*' />
//                     <div className='flex gap-4 mt-4'>
//                         {productData.images.map((image, index) => (
//                             <div key={index}>
//                                 <img src={image.url} alt='Product' className='w-20 h-20 object-cover rounded-md shadow-md' />
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <button type='submit' className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'>Update Product</button>
//             </form>
//         </div>
//     );
// };

// export default EditProductPage;
