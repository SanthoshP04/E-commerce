
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!orderDetails) return <p>No Order Details found</p>;

  const { _id, createdAt, isPaid, isDelivered, paymentMethod, shippingMethod, shippingAddress, orderItems } = orderDetails;

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6'>Order Details</h2>

      <div className='p-4 sm:p-6 rounded-lg border'>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className='text-lg md:text-xl font-semibold'>Order ID: #{_id}</h3>
            <p className='text-gray-600'>{new Date(createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
            <span className={`${isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
              {isPaid ? "Approved" : "Pending"}
            </span>
            <span className={`${isDelivered ? "bg-green-100 text-gray-700" : "bg-yellow-100 text-gray-700"} px-3 py-1 rounded-full text-sm font-medium`}>
              {isDelivered ? "Delivered" : "Pending"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className='text-lg font-semibold mb-2'>Payment Info</h4>
            <p>Payment Method: {paymentMethod}</p>
            <p>Status: {isPaid ? "Paid" : "Unpaid"}</p>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-2'>Shipping Info</h4>
            <p>Shipping Method: {shippingMethod || 'Standard'}</p>
            <p>Address: {shippingAddress ? `${shippingAddress.city}, ${shippingAddress.country}` : 'N/A'}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h4 className='text-lg font-semibold mb-4'>Products</h4>
          <table className='min-w-full text-gray-600 mb-4'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='py-2 px-4 text-left'>Image</th>
                <th className='py-2 px-4 text-left'>Name</th>
                <th className='py-2 px-4 text-left'>Unit Price</th>
                <th className='py-2 px-4 text-left'>Quantity</th>
                <th className='py-2 px-4 text-left'>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item) => (
                <tr key={item.productId} className='border-b'>
                  <td className='py-2 px-4'>
                    <img
                      src={item.image || '/fallback.jpg'}
                      alt={item.name}
                      className='w-12 h-12 object-cover rounded-lg'
                    />
                  </td>
                  <td className='py-2 px-4'>
                    <Link to={`/product/${item.productId}`} className='text-blue-500 hover:underline'>
                      {item.name}
                    </Link>
                  </td>
                  <td className='py-2 px-4'>₹{Number(item.price).toLocaleString()}</td>
                  <td className='py-2 px-4'>{item.quantity}</td>
                  <td className='py-2 px-4'>₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          to="/my-orders"
          className='mt-4 inline-block px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-600 transition'
        >
          Back To My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useParams } from 'react-router-dom';
// import { fetchOrderDetails } from '../redux/slices/orderSlice';

// const OrderDetailsPage = () => {
//     const { id } = useParams();
// const dispatch = useDispatch();
// const {orderDetails,loading,error}= useSelector((state)=>state.orders);

// useEffect(()=>{
//     dispatch(fetchOrderDetails(id));
// },[dispatch,id])

// if (loading) return <p>Loading ...</p>
// if(error) return <p>Error: {error}</p>
  
//     return (
//         <div className='max-w-7xl mx-auto p-4 sm:p-6'>
//             <h2 className='text-2xl md:text-3xl font-bold mb-6'>Order Details</h2>
//             {!orderDetails ? (
//                 <p>No Order Details found</p>
//             ) : (
//                 <div className='p-4 sm:p-6 rounded-lg border'>
//                     <div>
//                         <h3 className='text-lg md:text-xl font-semibold'>
//                             Order ID: #{orderDetails._id}
//                         </h3>
//                         <p className='text-gray-600'>
//                             {new Date(orderDetails.createdAt).toLocaleDateString()}
//                         </p>
//                         <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
//                             <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
//                                 {orderDetails.isPaid ? "Approved" : "Pending"}
//                             </span>
//                             <span className={`${orderDetails.isDelivered ? "bg-green-100 text-gray-700" : "bg-yellow-100 text-gray-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
//                                 {orderDetails.isDelivered ? "Delivered" : "Pending"}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
//                         <div>
//                             <h4 className='text-lg font-semibold mb-2'>Payment Info</h4>
//                             <p>Payment Method: {orderDetails.paymentMethod}</p>
//                             <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
//                         </div>
//                         <div>
//                             <h4 className='text-lg font-semibold mb-2'>Shipping Info</h4>
//                             <p>Shipping Method: {orderDetails.shippingMethod}</p>
//                             <p>Address: {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}</p>
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <h4 className='text-lg font-semibold mb-4'>Products</h4>
//                         <table className='min-w-full text-gray-600 mb-4'>
//                             <thead className='bg-gray-100'>
//                                 <tr>
//                                     <th className='py-2 px-4'>Image</th>
//                                     <th className='py-2 px-4'>Name</th>
//                                     <th className='py-2 px-4'>Unit Price</th>
//                                     <th className='py-2 px-4'>Quantity</th>
//                                     <th className='py-2 px-4'>Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {orderDetails.orderItems.map((item) => (
//                                     <tr key={item.productId} className='border-b'>
//                                         <td className='py-2 px-4'><img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded-lg' /></td>
//                                         <td className='py-2 px-4'><Link to={`/product/${item.productId}`} className='text-blue-500 hover:underline'>{item.name}</Link></td>
//                                         <td className='py-2 px-4'>₹{item.price}</td>
//                                         <td className='py-2 px-4'>{item.quantity}</td>
//                                         <td className='py-2 px-4'>₹{item.price * item.quantity}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                     <Link to="/my-orders" className='mt-4 inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition'>Back To My Orders</Link>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderDetailsPage;
