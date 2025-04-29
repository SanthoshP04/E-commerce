import React from 'react';
import { IoMdClose } from "react-icons/io";
import { CartContents } from '../Cart/CartContents';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart); // Fallback to auth if cart doesn't exist in root state
    const userId = user?._id || null;

    const handleCheckout = () => {
        toggleCartDrawer();
        navigate(user ? "/checkout" : "/login?redirect=checkout");
    };

    const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

    return (
        <div
            className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg 
            transform transition-transform duration-300 ease-in-out flex flex-col z-50 
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Header */}
            <div className='flex justify-between items-center p-4 border-b'>
                <h2 className='text-xl font-semibold'>Your Cart ({cartItemCount})</h2>
                <button
                    onClick={toggleCartDrawer}
                    aria-label="Close cart drawer"
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <IoMdClose className='h-6 w-6 text-gray-600 hover:text-gray-800' />
                </button>
            </div>

            {/* Cart Contents */}
            <div className='flex-grow p-4 overflow-y-auto'>
                {cartItemCount > 0 ? (
                    <CartContents cart={cart} userId={userId} guestId={guestId} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="mb-4">Your cart is empty</p>
                        <button
                            onClick={toggleCartDrawer}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>

            {/* Footer with Checkout */}
            {cartItemCount > 0 && (
                <div className='p-4 border-t bg-white sticky bottom-0'>
                    <button
                        onClick={handleCheckout}
                        className='w-full bg-black text-white py-3 rounded-lg font-semibold 
                        hover:bg-gray-800 transition-colors duration-200'
                    >
                        Proceed to Checkout
                    </button>
                    <p className='text-xs text-gray-500 mt-2 text-center'>
                        Shipping, taxes, and discounts calculated at checkout
                    </p>
                </div>
            )}
        </div>
    );
};

export default CartDrawer;

// import React from 'react'; // Removed unused useState import
// import { IoMdClose } from "react-icons/io";
// import { CartContents } from '../Cart/CartContents';
// import { useNavigate } from "react-router-dom";
// import { useSelector } from 'react-redux';

// const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
//     const navigate = useNavigate();
//     const { user, guestId } = useSelector((state) => state.auth);
//     const { cart } = useSelector((state) => state.auth);
//     const userId = user ? user._id : null;
//     const handleCheckout = () => {
//         toggleCartDrawer();

//         if (!user) {
//             navigate("/login?redirect=checkout");
//         } else {
//             navigate("/checkout");
//         }

//     };

//     return (
//         <div
//             className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 h-full bg-white shadow-lg
//             transform transition-transform duration-300 flex flex-col z-50
//             ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
//         >
//             {/* Header */}
//             <div className='flex justify-end p-4'>
//                 <button
//                     onClick={toggleCartDrawer}
//                     aria-label="Close cart drawer"
//                 >
//                     <IoMdClose className='h-6 w-6 text-gray-600 hover:text-gray-800 transition-colors' />
//                 </button>
//             </div>

//             {/* Cart Contents */}
//             <div className='flex-grow p-4 overflow-y-auto'>
//                 <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
//                 {cart && cart?.products?.length > 0 ? (<CartContents cart={cart} userId={userId} guestId={guestId} />) : (
//                     <p>Your Cart is empty.</p>
//                 )}

//             </div>

//             {/* Footer with Checkout */}
//             <div className='p-4 bg-white sticky bottom-0 border-t'>
//                 {cart && cart?.products?.length > 0 && (
//                     <>
//                         <button
//                             onClick={handleCheckout}
//                             className='w-full bg-black text-white py-3 rounded-lg font-semibold
//                     hover:bg-gray-800 transition-colors duration-200'
//                         >
//                             Checkout
//                         </button>
//                         <p className='text-sm tracking-tight text-gray-500 mt-2 text-center'>
//                             Shipping, taxes, and discounts calculated at checkout
//                         </p>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// };

// export default CartDrawer;