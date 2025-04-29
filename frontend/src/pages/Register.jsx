import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import registerImage from '../assets/saree.jpg'; // Renamed for clarity
import { registerUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added for password confirmation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, error, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Extract redirect parameter, default to "/"
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';
  const isCheckoutRedirect = redirect.includes('checkout');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const targetPath = isCheckoutRedirect ? '/checkout' : redirect;
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(targetPath, { replace: true });
        });
      } else {
        navigate(targetPath, { replace: true });
      }
    }
  }, [user, guestId, cart, redirect, isCheckoutRedirect, navigate]);

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Registration Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Clothing</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey There! 👋</h2>
          <p className="text-center mb-6">Enter your details to register</p>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={registerImage}
            alt="Woman in a saree"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;

// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
// import blacksuitwomen from '../../src/assets/saree.jpg'; // Correctly import the image
// import { registerUser } from '../redux/slices/authSlice';
// import { useDispatch } from 'react-redux';
// const Register = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [name, setName] = useState("");
//     const dispatch = useDispatch();

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user, guestId } = useSelector((state) => state.auth);
//     const { cart } = useSelector((state) => state.cart);

//     // Extract redirect parameter, default to "/"
//     const redirect = new URLSearchParams(location.search).get('redirect') || '/';
//     const isCheckoutRedirect = redirect.includes('checkout');

//     // Redirect if user is already logged in
//     useEffect(() => {
//         if (user) {
//             const targetPath = isCheckoutRedirect ? '/checkout' : redirect;
//             if (cart?.products?.length > 0 && guestId) {
//                 dispatch(mergeCart({ guestId, user })).then(() => {
//                     navigate(targetPath, { replace: true });
//                 });
//             } else {
//                 navigate(targetPath, { replace: true });
//             }
//         }
//     }, [user, guestId, cart, redirect, isCheckoutRedirect, navigate]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(registerUser({ name, email, password }));
//     }
//     return (
//         <div className='flex flex-col md:flex-row'>
//             {/* Left Side - Registration Form */}
//             <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
//                 <form onSubmit={handleSubmit}
//                     className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
//                     <div className='flex justify-center mb-6'>
//                         <h2 className='text-xl font-medium'>Clothing</h2>
//                     </div>
//                     <h2 className='text-2xl font-bold text-center mb-6'>
//                         Hey There !👋
//                     </h2>
//                     <p className='text-center mb-6'>
//                         Enter your user name and password to Register
//                     </p>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-semibold mb-2'>Name</label>
//                         <input
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className='w-full p-2 border rounded'
//                             placeholder='Enter your Name'
//                         />
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-semibold mb-2'>Email</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className='w-full p-2 border rounded'
//                             placeholder='Enter your email address'
//                         />
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-semibold mb-2'>Password</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className='w-full p-2 border rounded'
//                             placeholder='Enter your password'
//                         />
//                     </div>

//                     <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
//                         Sign Up
//                     </button>

//                     <p className='text-center mt-4'>
//                         Already have an account?{' '}
//                         <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}className="text-blue-500 hover:underline">
//                             Login
//                         </Link>
//                     </p>
//                 </form>
//             </div>

//             {/* Right Side - Image */}
//             <div className='w-full md:w-1/2 bg-gray-800'>
//                 <div className='h-full flex flex-col justify-center items-center'>
//                     <img
//                         src={blacksuitwomen}
//                         alt="Register to Account"
//                         className='w-full h-auto md:h-[750px] object-cover'
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Register;