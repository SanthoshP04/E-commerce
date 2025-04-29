import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters, fetchProductsByFilters } from '../../redux/slices/productsSlice';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm(''); // Clear search term when closing
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; // Prevent empty searches

    const normalizedSearchTerm = searchTerm.trim().toLowerCase(); // Case-insensitive search
    dispatch(setFilters({ search: normalizedSearchTerm }));
    dispatch(fetchProductsByFilters({ search: normalizedSearchTerm }));
    navigate(`/collections/all?search=${encodeURIComponent(normalizedSearchTerm)}`);
    setIsOpen(false); // Close search bar after submitting
  };

  const handleClear = () => {
    setSearchTerm(''); // Clear input field
  };

  return (
    <div
      className={`flex items-center transition-all duration-300 ${
        isOpen ? 'absolute top-0 left-0 w-full bg-white h-16 z-50' : 'w-auto'
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 pl-10 pr-20 py-2 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handleSearchToggle}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMiniXMark className="h-6 w-6" />
            </button>
          </div>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
// import React, { useState } from 'react';
// import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// const SearchBar = () => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isOpen, setIsOpen] = useState(false);
//     const dispatch = useDispatch()
//     const navigate = useNavigate();
//     const handleSearchToggle = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleSearch = (e) => {
//         e.preventDefault();
//         dispatch(setFilters({ search: searchTerm }));
//         dispatch(fetchProductsByFilters({ search: searchTerm }));
//         navigate(`/collections/all?search=${searchTerm}`);
//         setIsOpen(false);
//     };

//     return (
//         <div className={`flex items-center transition-all duration-300 ${isOpen
//             ? "absolute top-0 left-0 w-full bg-white h-16 z-50" // Changed h-24 to h-16
//             : "w-auto"
//             }`}>
//             {isOpen ? (
//                 <form
//                     onSubmit={handleSearch}
//                     className="relative flex items-center justify-center w-full"
//                 >
//                     <div className="relative w-1/2">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="bg-gray-100 pl-10 pr-12 py-2 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
//                         />
//                         <button
//                             type="button"
//                             onClick={handleSearchToggle}
//                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
//                         >
//                             <HiMiniXMark className="h-6 w-6" />
//                         </button>
//                     </div>
//                 </form>
//             ) : (
//                 <button onClick={handleSearchToggle}>
//                     <HiMagnifyingGlass className="h-6 w-6" />
//                 </button>
//             )}
//         </div>
//     );
// };

// export default SearchBar;