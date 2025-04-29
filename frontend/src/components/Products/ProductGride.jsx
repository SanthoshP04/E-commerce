import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductGrid = ({ products, loading, error }) => {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-lg animate-pulse">
            <div className="w-full h-96 mb-4 bg-gray-200 rounded-lg"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading products: {error.message || error}
      </div>
    );
  }

  // Empty state
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No products available</p>
        <Link 
          to="/" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Browse our collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="block group"
          aria-label={`View ${product.name} details`}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="w-full h-96 mb-4 overflow-hidden rounded-lg">
              <img
                src={product.images?.[0]?.url || '/default-image.jpg'}
                alt={product.images?.[0]?.altText || product.name || 'Product image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => { 
                  e.target.src = '/default-image.jpg';
                  e.target.alt = 'Default product image';
                }}
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                {product.name || 'Unnamed Product'}
              </h3>
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-gray-900 font-medium">
                  ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
                </span>
                {product.originalPrice && (
                  <span className="text-green-600 text-sm font-medium ml-auto">
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}% off
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      price: PropTypes.number,
      originalPrice: PropTypes.number,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
          altText: PropTypes.string,
        })
      ),
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

ProductGrid.defaultProps = {
  products: [],
  loading: false,
  error: null,
};

export default ProductGrid;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductGrid = ({ products, loading, error }) => {
//   if (loading) {
//     return <p>Loading...</p>

//   }
//   if (error) {
//     return <p>Error :{error}</p>
//   }
//   // Add check for empty or undefined products array
//   if (!products || !Array.isArray(products) || products.length === 0) {
//     return <div className="text-center py-8">No products available</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {products.map((product, index) => (
//         <Link
//           key={product._id || index} // Use product._id if available instead of index
//           to={`/product/${product._id}`}
//           className="block"
//         >
//           <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
//             <div className="w-full h-96 mb-4">
//               <img
//                 src={product.images?.[0]?.url || '/default-image.jpg'} // Fallback image
//                 alt={product.images?.[0]?.altText || product.name || 'Product image'}
//                 className="w-full h-full object-cover rounded-lg"
//                 onError={(e) => { e.target.src = '/default-image.jpg'; }} // Handle image loading errors
//               />
//             </div>
//             <h3 className="text-lg font-semibold">
//               {product.name || 'Unnamed Product'}
//             </h3>
//             <p className="text-gray-500">
//               ₹{product.price?.toLocaleString('en-IN') || 'Price unavailable'}
//             </p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default ProductGrid;