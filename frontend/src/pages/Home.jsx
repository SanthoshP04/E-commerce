import React, { useEffect, useState } from 'react';
import Hero from '../components/Layout/hero.jsx';
import GendercollectionSection from '../components/Products/GendercollectionSection.jsx';
import NewArrivals from '../components/Products/NewArrivals.jsx';
import ProductDetails from '../components/Products/ProductDetails.jsx';
import ProductGrid from '../components/Products/ProductGride.jsx'; // Fixed typo and clarified import
import FeaturedCollection from '../components/Products/FeaturedCollection.jsx';
import FeaturesSection from '../components/Products/FeaturesSection.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice.js';
import axios from 'axios';
import { toast } from 'sonner'; // Added for user feedback

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [bestSellerProduct, setBestSellerProduct] = useState(null); // Singular state name
  const [loadingBestSeller, setLoadingBestSeller] = useState(true); // Added loading state
  const [errorBestSeller, setErrorBestSeller] = useState(null); // Added error state

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: 'Women',
        category: 'Bottom Wear',
        limit: 8,
      })
    );

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        setLoadingBestSeller(true);
        setErrorBestSeller(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        // Validate response data (assuming API returns a single product object)
        if (response.data && response.data._id) {
          setBestSellerProduct(response.data);
        } else {
          throw new Error('Invalid best seller product data');
        }
      } catch (error) {
        console.error('Error fetching best seller:', error);
        setErrorBestSeller(error.message || 'Failed to load best seller product');
        toast.error('Failed to load best seller product. Please try again later.');
      } finally {
        setLoadingBestSeller(false);
      }
    };
    fetchBestSeller();
  }, []); // Removed dispatch from dependency array

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Hero />

      {/* Gender Collection Section */}
      <GendercollectionSection />

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Best Seller Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Best Seller</h2>
        {loadingBestSeller ? (
          <p className="text-center">Loading best seller product...</p>
        ) : errorBestSeller ? (
          <p className="text-center text-red-500">{errorBestSeller}</p>
        ) : bestSellerProduct ? (
          <ProductDetails productId={bestSellerProduct._id} />
        ) : (
          <p className="text-center">No best seller product available</p>
        )}
      </section>

      {/* Top Wears for Women Section */}
      <section className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women</h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </section>

      {/* Featured Collection and Features Section */}
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;


// import React, { useEffect, useState } from 'react';
// import Hero from '../components/Layout/hero.jsx';
// import GendercollectionSection from '../components/Products/GendercollectionSection.jsx';
// import NewArrivals from '../components/Products/NewArrivals.jsx';
// import ProductDetails from '../components/Products/ProductDetails.jsx';
// import ProductGride from '../components/Products/ProductGride.jsx'; // Renamed for clarity
// import FeaturedCollection from '../components/Products/FeaturedCollection.jsx';
// import FeaturesSection from '../components/Products/FeaturesSection.jsx';
// import { useDispatch, useSelector } from "react-redux"
// import { fetchProductsByFilters } from '../redux/slices/productsSlice.js';
// import axios from 'axios';

// const Home = () => {

//     const dispatch = useDispatch();
//     const { products, loading, error } = useSelector((state) => state.products);

//     const [bestSellerProducts, setBestSellerProduct] = useState();


//     useEffect(() => {
//         //Fetch product for a specific collection

//         dispatch(
//             fetchProductsByFilters({
//                 gender: "Women",
//                 category: "Bottom Wear",
//                 limit: 8,
//             })
//         );
//         //feth best seller product

//         const fetchBestSeller = async () => {
//             try {
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
//                 )
//                 setBestSellerProduct(response.data);
//             } catch (error) {
//                 console.error(error);

//             }
//         };
//         fetchBestSeller();
//     }, [dispatch])
//     return (
//         <div className="space-y-8">
//             {/* Hero Section */}
//             <Hero />

//             {/* Gender Collection Section */}
//             <GendercollectionSection />

//             {/* New Arrivals Section */}
//             <NewArrivals />

//             {/* Best Seller Section */}
//             <section className="text-center">
//                 <h2 className="text-3xl font-bold mb-4">Best Seller</h2>
//                 {bestSellerProducts ? (<ProductDetails prodctId={bestSellerProducts._id} />) : (
//                     <p className='text-center'>Loading best seller products...</p>
//                 )}

//             </section>

//             {/* Top Wears for Women Section */}
//             <section className="container mx-auto">
//                 <h2 className="text-3xl text-center font-bold mb-4">
//                     Top Wears for Women
//                 </h2>
//                 <ProductGride products={products} loading={loading} error={error} />
//             </section>
//             <FeaturedCollection />
//             <FeaturesSection />
//         </div>
//     );
// };

// export default Home;