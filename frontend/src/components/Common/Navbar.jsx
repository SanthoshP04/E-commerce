import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBars3BottomRight, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi2';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const { user } = useSelector((state) => state.auth)
    // Get cart from Redux store (assuming it's in state.cart)
    const { cart } = useSelector((state) => state.cart);

    // Calculate total items in cart
    const cartItemCount = cart?.products?.reduce((total, product) => total + (product.quantity || 1), 0) || 0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    const toggleCartDrawer = () => {
        setCartDrawerOpen(!cartDrawerOpen);
        // Close nav drawer if open when opening cart
        if (navDrawerOpen && !cartDrawerOpen) {
            setNavDrawerOpen(false);
        }
    };

    return (
        <div className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
                {/* Logo / Home Link */}
                <div className="flex-1 md:flex-none">
                    <Link
                        to="/"
                        className="text-2xl font-semibold text-gray-800 hover:text-gray-600 transition-colors"
                        onClick={() => {
                            setNavDrawerOpen(false);
                            setCartDrawerOpen(false);
                        }}
                    >
                        Home
                    </Link>
                </div>

                {/* Navigation Links - Hidden on mobile, shown on medium+ screens */}
                <div className="hidden md:flex space-x-6 mx-4">
                    <Link to="/collections/all?gender=Men" className="nav-link hover:text-gray-600 transition-colors">MEN</Link>
                    <Link to="/collections/all?gender=Women" className="nav-link hover:text-gray-600 transition-colors">WOMEN</Link>
                    <Link to="/collections/all?category=Top+Wear" className="nav-link hover:text-gray-600 transition-colors">TOP WEAR</Link>
                    <Link to="/collections/all?category=Bottom+Wear" className="nav-link hover:text-gray-600 transition-colors">BOTTOM WEAR</Link>
                </div>

                {/* Icons: User, Cart, Mobile Menu */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Search Bar - Hidden on mobile if nav drawer is open */}
                    {!navDrawerOpen && (
                        <div className="hidden md:block">
                            <SearchBar />
                        </div>
                    )}

                    {/* Admin Link */}

                    {user && user.role === "admin" && (<Link to='/admin' className='hidden md:block bg-black px-3 py-1 rounded text-sm text-white hover:bg-gray-800 transition-colors'>
                        Admin
                    </Link>)}

                    {/* User Profile Icon */}
                    <Link
                        to="/profile"
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => {
                            setNavDrawerOpen(false);
                            setCartDrawerOpen(false);
                        }}
                    >
                        <HiOutlineUser className="h-6 w-6 text-gray-700" />
                    </Link>

                    {/* Shopping Bag with Cart Count */}
                    <button
                        onClick={toggleCartDrawer}
                        className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Cart"
                    >
                        <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Button (Hidden on Desktop) */}
                    <button
                        onClick={toggleNavDrawer}
                        className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Menu"
                    >
                        {navDrawerOpen ? (
                            <IoMdClose className="h-6 w-6 text-gray-700" />
                        ) : (
                            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Cart Drawer */}
            <CartDrawer drawerOpen={cartDrawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Mobile Navigation Drawer */}
            <div
                className={`fixed top-0 left-0 w-4/5 max-w-xs h-full bg-white shadow-lg transform transition-transform duration-300 z-40
                ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">MENU</h2>
                        <button
                            onClick={toggleNavDrawer}
                            className="p-1 hover:bg-gray-100 rounded-full"
                            aria-label="Close menu"
                        >
                            <IoMdClose className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                to="/collections/all?gender=Men"
                                className="nav-link py-2 px-3 hover:bg-gray-100 rounded transition-colors"
                                onClick={toggleNavDrawer}
                            >
                                MEN
                            </Link>
                            <Link
                                to="/collections/all?gender=Women"
                                className="nav-link py-2 px-3 hover:bg-gray-100 rounded transition-colors"
                                onClick={toggleNavDrawer}
                            >
                                WOMEN
                            </Link>
                            <Link
                                to="/collections/all?category=Top+Wear"
                                className="nav-link py-2 px-3 hover:bg-gray-100 rounded transition-colors"
                                onClick={toggleNavDrawer}
                            >
                                TOP WEAR
                            </Link>
                            <Link
                                to="/collections/all?category=Bottom+Wear"
                                className="nav-link py-2 px-3 hover:bg-gray-100 rounded transition-colors"
                                onClick={toggleNavDrawer}
                            >
                                BOTTOM WEAR
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Overlay when mobile menu is open */}
            {navDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleNavDrawer}
                />
            )}
        </div>
    );
};

export default Navbar;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { HiBars3BottomRight, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi2';
// import SearchBar from './SearchBar';
// import CartDrawer from '../Layout/CartDrawer';
// import { IoMdClose } from 'react-icons/io';
// import { useSelector } from 'react-redux';
// import products from '../../../../backend/data/products';

// const Navbar = () => {
//     const [navDrawerOpen, setNavDrawerOpen] = useState(false);
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const { cart } = useSelector((state) => state.cart);
//     const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity,
//         0) || 0;
//     const toggleNavDrawer = () => {
//         setNavDrawerOpen(!navDrawerOpen);
//     };

//     const toggleCartDrawer = () => {
//         setDrawerOpen(!drawerOpen);
//     };

//     return (
//         <div className="bg-white shadow-md sticky top-0 z-50">
//             <nav className="container mx-auto flex items-center justify-between py-4 px-6">

//                 {/* Logo / Home Link */}
//                 <div>
//                     <Link to="/" className="text-2xl font-semibold text-gray-800 hover:text-gray-600 transition-all">
//                         Home
//                     </Link>
//                 </div>

//                 {/* Navigation Links - Hidden on mobile, shown on medium+ screens */}
//                 <div className="hidden md:flex space-x-6">
//                     <Link to="/collections/all?gemder=Men" className="nav-link">MEN</Link>
//                     <Link to="/collections/all?gemder=Women" className="nav-link">WOMEN</Link>
//                     <Link to="/collections/all?category=Top+Wear" className="nav-link">TOP WEAR</Link>
//                     <Link to="/collections/all?category=Bottom+Wear" className="nav-link">BOTTOM WEAR</Link>
//                 </div>

//                 {/* Icons: User, Cart, Mobile Menu */}
//                 <div className="flex items-center space-x-6 " >
//                     {/* User Profile Icon */}
//                     <Link to='/admin' className='block bg-black px-2 rounded text-sm text-white'>Admin</Link>
//                     <Link to="/profile" className="icon-button">
//                         <HiOutlineUser className="h-6 w-6" />
//                     </Link>

//                     {/* Shopping Bag with Cart Count */}
//                     <button onClick={toggleCartDrawer} className="relative icon-button">
//                         <HiOutlineShoppingBag className="h-6 w-6" />
//                         {cartItemCount > 0 && (<span className="absolute -top-3 -right-2 bg-red-700 text-white text-xs font-semibold rounded-full px-2 py-0.5">
//                             {cartItemCount}
//                         </span>)}

//                     </button>
//                     <div className="overflow-hidden">
//                         <SearchBar />
//                     </div>

//                     {/* Mobile Menu Button (Hidden on Desktop) */}
//                     <button onClick={toggleNavDrawer} className="md:hidden icon-button">
//                         <HiBars3BottomRight className="h-6 w-6" />
//                     </button>
//                 </div>
//             </nav>
//             <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

//             {/* Mobile Menu (Visible when state is true) */}
//             <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300
//             z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>

//                 <div className="flex justify-end p-4">
//                     <button onClick={toggleNavDrawer}>
//                         <IoMdClose className="h-6 w-6 text-gray-600" />
//                     </button>
//                 </div>

//                 {/* Mobile Navigation Links */}
//                 <div className="flex flex-col space-y-4 p-4">
//                     <h2 className='text-xl font-semibold mb-4'>MENU</h2>
//                     <nav><Link to="/collections/all?gemder=Men" className="nav-link block py-2" onClick={toggleNavDrawer}>MEN</Link>
//                         <Link to="/collections/all?gemder=Women" className="nav-link block py-2" onClick={toggleNavDrawer}>WOMEN</Link>
//                         <Link to="/collections/all?category=Top+Wear" className="nav-link block py-2" onClick={toggleNavDrawer}>TOP WEAR</Link>
//                         <Link to="/collections/all?category=Bottom+Wear" className="nav-link block py-2" onClick={toggleNavDrawer}>BOTTOM WEAR</Link>
//                     </nav>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Navbar;