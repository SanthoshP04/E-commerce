import React, { useState } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";

export const CartContents = ({ userId, guestId }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  
  // Track image loading errors
  const [imageErrors, setImageErrors] = useState({});

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  const handleImageError = (productId, size, color) => {
    // Mark this specific product-size-color combination as having an image error
    setImageErrors(prev => ({
      ...prev,
      [`${productId}-${size}-${color}`]: true
    }));
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {cart.products.map((product) => {
        const itemKey = `${product.productId}-${product.size}-${product.color}`;
        const hasImageError = imageErrors[itemKey];
        
        return (
          <div
            key={itemKey}
            className="flex items-start justify-between py-4 border-b"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                {!hasImageError ? (
                  <img
                    src={product.image || "/images/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded"
                    onError={(e) => {
                      handleImageError(product.productId, product.size, product.color);
                      e.target.src = "/images/placeholder-product.jpg";
                      e.target.className = "w-20 h-24 object-contain rounded bg-gray-100";
                    }}
                  />
                ) : (
                  <img
                    src="/images/placeholder-product.jpg"
                    alt={`${product.name} (placeholder)`}
                    className="w-20 h-24 object-contain rounded bg-gray-100"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Size: {product.size} | Color: {product.color}
                </p>
                <p className="text-lg font-semibold mt-1">₹{product.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    className="border rounded px-2 py-1 text-lg font-medium hover:bg-gray-100"
                    onClick={() =>
                      handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)
                    }
                    disabled={product.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="mx-4">{product.quantity}</span>
                  <button
                    className="border rounded px-2 py-1 text-lg font-medium hover:bg-gray-100"
                    onClick={() =>
                      handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}
                className="mt-2 hover:text-red-700"
                aria-label="Remove item"
              >
                <RiDeleteBin3Line className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContents;
// import React, { useEffect } from 'react';
// import { RiDeleteBin3Line } from 'react-icons/ri';
// import { useDispatch, useSelector } from 'react-redux';
// import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

// export const CartContents = ({ userId, guestId }) => {
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.cart.cart); // updated to get live state from Redux

//   const handleAddToCart = (productId, delta, quantity, size, color) => {
//     const newQuantity = quantity + delta;
//     if (newQuantity >= 1) {
//       dispatch(
//         updateCartItemQuantity({
//           productId,
//           quantity: newQuantity,
//           guestId,
//           userId,
//           size,
//           color,
//         })
//       );
//     }
//   };

//   const handleRemoveFromCart = (productId, size, color) => {
//     dispatch(removeFromCart({ productId, guestId, userId, size, color }));
//   };

//   if (!cart || !cart.products) return <p className="p-4">Your cart is empty.</p>;

//   return (
//     <div>
//       {cart.products.map((product) => (
//         <div
//           key={`${product.productId}-${product.size}-${product.color}`}
//           className="flex items-start justify-between py-4 border-b"
//         >
//           <div className="flex items-start">
//             <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4 rounded" />
//             <div>
//               <h3>{product.name}</h3>
//               <p className="text-sm text-gray-500">
//                 Size: {product.size} | Color: {product.color}
//               </p>
//               <div className="flex items-center mt-2">
//                 <button
//                   className="border rounded px-2 py-1 text-xl font-medium"
//                   onClick={() =>
//                     handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)
//                   }
//                 >
//                   -
//                 </button>
//                 <span className="mx-4">{product.quantity}</span>
//                 <button
//                   className="border rounded px-2 py-1 text-xl font-medium"
//                   onClick={() =>
//                     handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)
//                   }
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div>
//             <p className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</p>
//             <button onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}>
//               <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// import React from 'react';
// import { RiDeleteBin3Line } from 'react-icons/ri';
// import { useDispatch } from 'react-redux';
// import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';


// export const CartContents = ({ cart, userId, guestId }) => {


//   const dispatch = useDispatch();

//   //handel adding or subtracting to cart

//   const handleAddToCart = (productId, delta, quantity, size, color) => {
//     const newQuantity = quantity + delta;
//     if (newQuantity >= 1) {
//       dispatch(
//         updateCartItemQuantity({
//           productId,
//           quantity: newQuantity,
//           guestId,
//           userId,
//           size,
//           color,

//         })
//       )
//     }

//   }
//   const handelRemoveFromCart = (productId, size, color) => {
//     dispatch(removeFromCart({ productId, guestId, userId, size, color }));
//   }

//   return (
//     <div>
//       {cart.products.map((product, index) => (
//         <div key={index} className="flex items-start justify-between py-4 border-b">
//           <div className="flex items-start">
//             <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4 rounded" />
//             <div>
//               <h3>{product.name}</h3>
//               <p className="text-sm text-gray-500">
//                 Size: {product.size} | Color: {product.color}
//               </p>
//               <div className="flex items-center mt-2">
//                 <button
//                   className="border rounded px-2 py-1 text-xl font-medium"
//                   onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}
//                 >
//                   -
//                 </button>
//                 <span className="mx-4">{product.quantity}</span>
//                 <button
//                   className="border rounded px-2 py-1 text-xl font-medium"
//                   onClick={() => handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div>
//             <p className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</p>
//             <button onClick={() => handelRemoveFromCart(product.productId,product.size,product.color)}>
//               <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };