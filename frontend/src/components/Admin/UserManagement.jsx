import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, updateUser, deleteUser, fetchUsers } from '../../redux/slices/adminSlice';

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { users, loading, error } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(fetchUsers());
        }
    }, [dispatch, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, password } = formData;
        if (!name || !email || password.length < 8) {
            alert("All fields are required and password must be at least 8 characters.");
            return;
        }

        dispatch(addUser(formData));
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer",
        });
    };

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, role: newRole }));
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId));
        }
    };

    const isFormValid = formData.name && formData.email && formData.password.length >= 8;

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='text-2xl font-bold mb-4'>User Management</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className='p-6 rounded-lg mb-6 bg-white shadow'>
                <h3 className='text-lg font-bold mb-4'>Add New User</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Name</label>
                        <input type="text" name='name' value={formData.name} onChange={handleChange} className='w-full p-2 border rounded' />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Email</label>
                        <input type="email" name='email' value={formData.email} onChange={handleChange} className='w-full p-2 border rounded' />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded pr-10"
                                minLength={8}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center">
                                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
                            </button>
                        </div>
                        {formData.password && formData.password.length < 8 && (
                            <p className="text-sm text-red-500 mt-1">Password must be at least 8 characters</p>
                        )}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Role</label>
                        <select name='role' value={formData.role} onChange={handleChange} className='w-full p-2 border rounded'>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type='submit'
                        disabled={!isFormValid}
                        className={`py-2 px-4 rounded text-white ${isFormValid ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Add User
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className='min-w-full text-left text-gray-500 bg-white'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4'>Email</th>
                            <th className='py-3 px-4'>Role</th>
                            <th className='py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className='border-b hover:bg-gray-50'>
                                <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{user.name}</td>
                                <td className='p-4'>{user.email}</td>
                                <td className='p-4'>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className='p-2 border rounded'
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className='p-4'>
                                    <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;


// import React, { useEffect, useState } from 'react';
// import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { addUser, updateUser, deleteUser, fetchUsers } from '../../redux/slices/adminSlice';

// const UserManagement = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { user } = useSelector((state) => state.auth);
//     const { users, loading, error } = useSelector((state) => state.admin);

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         role: "customer",
//     });

//     const [showPassword, setShowPassword] = useState(false);

//     useEffect(() => {
//         if (user && user.role !== "admin") {
//             navigate("/");
//         }
//     }, [user, navigate]);
//     useEffect (()=>{
//         if(user && user.role ==="admin"){
//             dispatch(fetchUsers());
//         }
//     },[dispatch,user])

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Optional validation
//         if (!formData.name || !formData.email || !formData.password) {
//             alert("All fields are required.");
//             return;
//         }

//         dispatch(addUser(formData));
//         setFormData({
//             name: "",
//             email: "",
//             password: "",
//             role: "customer",
//         });
//     };

//     const handleRoleChange = (userId, newRole) => {
//         dispatch(updateUser({ id: userId, role: newRole })); // ✅ Fixed typo
//     };

//     const handleDeleteUser = (userId) => {
//         if (window.confirm("Are you sure you want to delete this user?")) {
//             dispatch(deleteUser(userId));
//         }
//     };

//     return (
//         <div className='max-w-7xl mx-auto p-6'>
//             <h2 className='text-2xl font-bold mb-4'>User Management</h2>

//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">Error: {error}</p>}

//             <div className='p-6 rounded-lg mb-6 bg-white shadow'>
//                 <h3 className='text-lg font-bold mb-4'>Add New User</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700'>Name</label>
//                         <input type="text" name='name' value={formData.name} onChange={handleChange} className='w-full p-2 border rounded' />
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700'>Email</label>
//                         <input type="email" name='email' value={formData.email} onChange={handleChange} className='w-full p-2 border rounded' />
//                     </div>
//                     <div className="mb-4 relative">
//                         <label className="block text-gray-700">Password</label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border rounded pr-10"
//                             />
//                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center">
//                                 {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
//                             </button>
//                         </div>
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700'>Role</label>
//                         <select name='role' value={formData.role} onChange={handleChange} className='w-full p-2 border rounded'>
//                             <option value="customer">Customer</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                     </div>
//                     <button type='submit' className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>Add User</button>
//                 </form>
//             </div>

//             <div className="overflow-x-auto shadow-md sm:rounded-lg">
//                 <table className='min-w-full text-left text-gray-500 bg-white'>
//                     <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
//                         <tr>
//                             <th className='py-3 px-4'>Name</th>
//                             <th className='py-3 px-4'>Email</th>
//                             <th className='py-3 px-4'>Role</th>
//                             <th className='py-3 px-4'>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user._id} className='border-b hover:bg-gray-50'>
//                                 <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{user.name}</td>
//                                 <td className='p-4'>{user.email}</td>
//                                 <td className='p-4'>
//                                     <select
//                                         value={user.role}
//                                         onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                                         className='p-2 border rounded'
//                                     >
//                                         <option value="customer">Customer</option>
//                                         <option value="admin">Admin</option>
//                                     </select>
//                                 </td>
//                                 <td className='p-4'>
//                                     <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>Delete</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UserManagement;

// import React, { useState } from 'react'
// import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

// import{useDispatch} from "react-redux";
// const UserManagement = () => {

// const dispatch = useDispatch();
// const navigate = useNavigate()
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         role: "customer",
//     });

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,

//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData);
//         setFormData({
//             name: "",
//             email: "",
//             password: "",
//             role: "customer",
//         })
//     };

//     const handleRoleChange = (userId, newRole) => {
//         console.log({ id: userId, role: newRole });
//     }
//     const handleDeleteUser = (userId) => {
//         if (window.confirm("Are you sure you want to delete this user?")) {
//             console.log("deleting user with ID", userId);
//         }

//     }
//     const [showPassword, setShowPassword] = useState(false);
//     return (
//         <div className='max-w-7xl mx-auto p-6'>
//             <h2 className='text-2xl font-bold mb-4'>User Management</h2>
//             {/* add new user form */}
//             <div className='p-6 rounded-lg mb-6'>
//                 <h3 className='text-lg font-bold mb-4'>Add New User</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700'>Name</label>
//                         <input type="text"
//                             name='name'
//                             value={formData.name}
//                             onChange={handleChange}
//                             className='w-full p-2 border rounded'
//                         />
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700'>Email</label>
//                         <input type="email"
//                             name='email'
//                             value={formData.email}
//                             onChange={handleChange}
//                             className='w-full p-2 border rounded'
//                         />
//                     </div>
//                     <div className="mb-4 relative">
//                         <label className="block text-gray-700">Password</label>
//                         <div className="relative">
//                             <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded pr-10" />
//                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center">
//                                 {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
//                             </button>
//                         </div>
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700'>Role</label>
//                         <select
//                             name='role'
//                             value={formData.role}
//                             onChange={handleChange}
//                             className='w-full p-2 border rounded'
//                         >
//                             <option value="customer">Customer</option>
//                             <option value="admin">Admin</option>

//                         </select>
//                     </div>
//                     <button type='submit' className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>Add User</button>
//                 </form>
//             </div>
//             {/* user list */}
//             <div className="overflow-x-auto shadow-md sm:rounded-lg">
//                 <table className='min-w-full text-left text-gray-500'>
//                     <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
//                         <tr>
//                             <th className='py-3 px-4'>Name</th>
//                             <th className='py-3 px-4'>Email</th>

//                             <th className='py-3 px-4'>Role</th>

//                             <th className='py-3 px-4'>Actions</th>


//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user._id} className='border-b hover:bg-gray-50'>
//                                 <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
//                                     {user.name}
//                                 </td>
//                                 <td className='p-4'>{user.email}</td>
//                                 <td className='p-4'><select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                                     className='p-2 border rounded'>
//                                     <option value="customer">Customer</option>
//                                     <option value="admin">Admin</option>

//                                 </select></td>
//                                 <td className='p-4'>
//                                     <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>Delete</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }

// export default UserManagement