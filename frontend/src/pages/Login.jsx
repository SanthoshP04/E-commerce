import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import loginImage from '../assets/blacksuitmens.jpg'; // Updated import name for clarity
import { loginUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password.');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Clothing</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey There! 👋</h2>
          <p className="text-center mb-6">Enter your email and password to login</p>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

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

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center mt-4">
            Don't have an account?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={loginImage}
            alt="Man in a black suit"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
// import login from '../../src/assets/blacksuitmens.jpg'; // Correctly import the image
// import { loginUser } from "../redux/slices/authSlice";
// import { useDispatch, useSelector } from 'react-redux';
// import { mergeCart } from '../redux/slices/cartSlice';


// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user, guestId } = useSelector((state) => state.auth);
//     const { cart } = useSelector((state) => state.cart);
//     //get  redirect paramerter and check if it's or something
//     const redirect = new URLSearchParams(location.search).get("redirect") || "/";
//     const isCheckoutRedirect = redirect.includes("checkout");


//     useEffect(() => {
//         if (user) {
//             if (cart?.products.length > 0 && guestId) {
//                 dispatch(mergeCart({ guestId, user })).then(() => {
//                     navigate(isCheckoutRedirect ? "/checkout" : "/")
//                 })
//             } else {
//                 navigate(isCheckoutRedirect ? "/checkout" : "/")
//             }
//         }
//     },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch])

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(loginUser({ email, password }));
//     }
//     return (
//         <div className='flex'>
//             {/* Left Side - Login Form */}
//             <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
//                 <form
//                     onSubmit={handleSubmit}
//                     className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
//                     <div className='flex justify-center mb-6'>
//                         <h2 className='text-xl font-medium'>Clothing</h2>
//                     </div>
//                     <h2 className='text-2xl font-bold text-center mb-6'>
//                         Hey There !👋
//                     </h2>
//                     <p className='text-center mb-6'>
//                         Enter your email and password to login
//                     </p>
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
//                         Sign In
//                     </button>

//                     <p className='text-center mt-4'>
//                         Don't have an account?{' '}
//                         <Link to={`/register?redirect=${encodeURIComponent(redirect)} `}className="text-blue-500 hover:underline">
//                             Register
//                         </Link>
//                     </p>
//                 </form>
//             </div>

//             {/* Right Side - Image */}
//             <div className='hidden md:block w-1/2 bg-gray-800'>
//                 <div className='h-full flex flex-col justify-center items-center'>
//                     <img src={login} alt="Login to Account" className='h-[750px] w-full object-cover' />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;