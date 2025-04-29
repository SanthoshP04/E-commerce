
import axios from 'axios';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [error, setError] = useState(null);

  // Fetch new arrivals
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setError('Failed to load new arrivals. Please try again later.');
      }
    };
    fetchNewArrivals();
  }, []);

  // Total items for navigation
  const totalItems = newArrivals.length;

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index) => {
      const container = scrollRef.current;
      if (!container || totalItems === 0) return;

      const itemWidth = container.scrollWidth / totalItems;
      const boundedIndex = Math.max(0, Math.min(index, totalItems - 1));

      container.scrollTo({
        left: boundedIndex * itemWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(boundedIndex);
    },
    [totalItems]
  );

  // Scroll left or right
  const scroll = useCallback(
    (direction) => {
      let newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
      newIndex = (newIndex + totalItems) % totalItems; // Circular navigation
      scrollToIndex(newIndex);
    },
    [currentIndex, totalItems, scrollToIndex]
  );

  // Auto-scroll effect
  useEffect(() => {
    if (totalItems === 0) return;

    const intervalId = setInterval(() => {
      scroll('right');
    }, 3000);

    autoScrollIntervalRef.current = intervalId;

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [scroll, totalItems]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-[600px] flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-8 animate-fade-in">
        Explore New Arrivals
      </h2>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 font-medium text-lg mb-8 animate-fade-in">
          {error}
        </div>
      )}

      {/* Loading State */}
      {newArrivals.length === 0 && !error && (
        <div className="text-gray-500 font-medium text-lg mb-8 animate-pulse">
          Loading new arrivals...
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          disabled={totalItems === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous products"
        >
          <FiChevronLeft className="text-3xl text-gray-800" />
        </button>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto snap-x scroll-smooth scrollbar-hide"
        >
          <div className="flex space-x-6 p-4">
            {newArrivals.map((product, index) => (
              <div
                key={product._id || index}
                className="w-64 sm:w-72 flex-shrink-0 bg-white p-4 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 snap-start animate-fade-in"
              >
                <img
                  src={product.images?.[0]?.url || '/fallback-image.jpg'}
                  alt={product.images?.[0]?.altText || product.name || 'Product'}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = '/fallback-image.jpg';
                  }}
                  loading="lazy"
                />
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate w-full mb-2">
                    {product.name || 'Unnamed Product'}
                  </h3>
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    ₹{(product.price || 0).toLocaleString('en-IN')}
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-200"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll('right')}
          disabled={totalItems === 0}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next products"
        >
          <FiChevronRight className="text-3xl text-gray-800" />
        </button>
      </div>

      {/* Navigation Dots */}
      {totalItems > 0 && (
        <div className="flex justify-center gap-3 mt-6">
          {newArrivals.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gray-900 scale-125'
                  : 'bg-gray-400 hover:bg-gray-500 hover:scale-110'
              }`}
              aria-label={`Go to product ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;

// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import { Link } from 'react-router-dom';
// const NewArrivals = () => {
//     const scrollRef = useRef(null);
//     const autoScrollIntervalRef = useRef(null);
//     const [currentIndex, setCurrentIndex] = useState(0);


//     const [newArrivals, setNewArrivals] = useState([]);
//     useEffect(() => {
//         const fetchNewArrivals = async () => {
//             try {
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
//                 );
//                 setNewArrivals(response.data)
//             } catch (error) {
//                 console.error(error);

//             }
//         }
//         fetchNewArrivals();
//     }, [])

//     const scrollToIndex = (index) => {
//         const container = scrollRef.current;
//         if (!container) return;

//         const itemWidth = container.scrollWidth / totalItems;
//         const boundedIndex = Math.max(0, Math.min(index, totalItems - 1));

//         container.scrollTo({
//             left: boundedIndex * itemWidth,
//             behavior: 'smooth'
//         });
//         setCurrentIndex(boundedIndex);
//     };

//     const scroll = (direction) => {
//         let newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
//         newIndex = (newIndex + totalItems) % totalItems; // Circular navigation
//         scrollToIndex(newIndex);
//     };

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             scroll("right");
//         }, 3000);

//         autoScrollIntervalRef.current = intervalId;

//         return () => {
//             if (autoScrollIntervalRef.current) {
//                 clearInterval(autoScrollIntervalRef.current);
//             }
//         };
//     }, [currentIndex]); // Keep currentIndex in dependency array for consistent updates

//     return (
//         <section className="py-12 text-center relative w-full overflow-hidden flex flex-col justify-center">
//             <h2 className="text-4xl font-bold mb-4">Explore New Arrivals</h2>
//             <div className="relative flex items-center w-full px-8">
//                 <button
//                     onClick={() => scroll("left")}
//                     className="absolute left-0 z-10 p-2 bg-white bg-opacity-50 rounded-full shadow-lg hover:bg-opacity-75 transition-opacity"
//                     aria-label="Previous products"
//                 >
//                     <FiChevronLeft className="text-2xl" />
//                 </button>
//                 <div
//                     ref={scrollRef}
//                     className="w-full flex overflow-x-auto snap-x scroll-smooth scrollbar-hide"
//                 >
//                     <div className="flex space-x-4 p-4">
//                         {newArrivals.map((product) => (
//                             <div
//                                 key={product._id}
//                                 className="w-48 sm:w-64 flex-shrink-0 bg-white p-2 rounded-lg shadow-lg relative flex flex-col h-80"
//                                 style={{ scrollSnapAlign: 'start' }}
//                             >
//                                 <img
//                                     src={product.images[0]?.url || '/fallback-image.jpg'}
//                                     alt={product.images[0]?.altText || product.name}
//                                     className="w-full h-3/4 object-cover rounded-md"
//                                     onError={(e) => { e.target.src = '/fallback-image.jpg'; }}
//                                     loading="lazy"
//                                 />
//                                 <div className="flex flex-col items-center p-2 bg-white rounded-md absolute bottom-0 left-0 right-0">
//                                     <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate w-full">
//                                         {product.name}
//                                     </h3>
//                                     <p className="text-xs font-medium text-black">
//                                         ₹{product.price.toLocaleString('en-IN')}
//                                     </p>
//                                     <Link
//                                         to={`/product/${product._id}`}
//                                         className="bg-black text-white px-2 py-1 rounded-md text-xs font-medium mt-1 hover:bg-gray-800 transition-colors"
//                                     >
//                                         Shop Now
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => scroll("right")}
//                     className="absolute right-0 z-10 p-2 bg-white bg-opacity-50 rounded-full shadow-lg hover:bg-opacity-75 transition-opacity"
//                     aria-label="Next products"
//                 >
//                     <FiChevronRight className="text-2xl" />
//                 </button>
//             </div>
//             <div className="flex justify-center gap-2 mt-4">
//                 {newArrivals.map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={() => scrollToIndex(index)}
//                         className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-black' : 'bg-gray-400 hover:bg-gray-500'
//                             }`}
//                         aria-label={`Go to product ${index + 1}`}
//                     />
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default NewArrivals;