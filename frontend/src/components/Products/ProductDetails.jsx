import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGride"; // Ensure correct import path
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
  resetSelectedProduct,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [selectedImageForCart, setSelectedImageForCart] = useState("");
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    }
    return () => {
      dispatch(resetSelectedProduct());
    };
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (!selectedProduct) return;

    const images = selectedProduct.images?.filter((img) => img?.url) || [];
    const validUrls = images.map((img) => img.url);

    setProductImages(validUrls);

    if (validUrls.length > 0) {
      const firstImage = validUrls[0];
      setMainImage(firstImage); // Set initial main image
      setSelectedImageForCart(firstImage); // Set initial image for cart

      const img = new Image();
      img.src = firstImage;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        setMainImage("");
        setSelectedImageForCart("");
        setImageDimensions({ width: 0, height: 0 });
      };
    } else {
      setMainImage("");
      setSelectedImageForCart("");
      setImageDimensions({ width: 0, height: 0 });
    }

    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
    setSelectedImageForCart(imageUrl);
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      const nextImage = productImages.find((imgUrl) => imgUrl !== imageUrl);
      setMainImage(nextImage || "");
      setSelectedImageForCart(nextImage || "");
      setImageDimensions({ width: 0, height: 0 });
    };
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size.", { duration: 1000 });
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color.", { duration: 1000 });
      return;
    }
    if (!selectedImageForCart) {
      toast.error("Please select an image for the product.", { duration: 1000 });
      return;
    }

    // Validate that selectedImageForCart is a valid URL
    try {
      new URL(selectedImageForCart);
    } catch {
      toast.error("Invalid image selected for the cart.", { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true);

    const productData = {
      productId: productFetchId,
      name: selectedProduct.name || "Unnamed Product",
      price: selectedProduct.price || 0,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: selectedImageForCart, // Send selected image to cart
      altText: `${selectedProduct.name} - Selected Image` || "Product image",
      guestId,
      userId: user?._id,
    };

    dispatch(addToCart(productData))
      .unwrap()
      .then(() => {
        toast.success("Product added to the cart!", { duration: 1000 });
      })
      .catch((err) => {
        toast.error(`Failed to add to cart: ${err.message || "Unknown error"}`, {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // Calculate dynamic border width based on image dimensions
  const calculateBorderWidth = () => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0) return 4;
    const smallerDimension = Math.min(imageDimensions.width, imageDimensions.height);
    return Math.max(2, Math.min(8, smallerDimension * 0.01));
  };

  // Calculate dynamic container width based on image dimensions
  const calculateContainerWidth = () => {
    if (imageDimensions.width === 0) return "100%";
    const scaledWidth = Math.max(200, Math.min(500, imageDimensions.width * 0.8));
    return `${scaledWidth}px`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedProduct) return <p>Product not found</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Image */}
          <div>
            <div
              className="mb-4 overflow-hidden rounded-lg border-gray-300 mx-auto"
              style={{
                borderWidth: `${calculateBorderWidth()}px`,
                width: calculateContainerWidth(),
                maxHeight: "400px",
                aspectRatio: imageDimensions.width / imageDimensions.height || 1,
                overflow: "hidden",
              }}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={`${selectedProduct.name} - Main Image`}
                  className="w-full h-full object-contain transition-all duration-300"
                  onError={() => {
                    const nextImage = productImages.find((img) => img !== mainImage);
                    setMainImage(nextImage || "");
                    setSelectedImageForCart(nextImage || "");
                    setImageDimensions({ width: 0, height: 0 });
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {productImages.length > 0 ? (
                productImages.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      mainImage === img ? "border-black" : "border-gray-200"
                    }`}
                    onClick={() => handleThumbnailClick(img)}
                  >
                    <img
                      src={img}
                      alt={`${selectedProduct.name} - Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover"
                      onError={(e) => {
                        setProductImages((prev) => prev.filter((imgUrl) => imgUrl !== img));
                        if (mainImage === img || selectedImageForCart === img) {
                          const nextImage = productImages.find((imgUrl) => imgUrl !== img);
                          setMainImage(nextImage || "");
                          setSelectedImageForCart(nextImage || "");
                          setImageDimensions({ width: 0, height: 0 });
                        }
                        e.target.parentNode.style.display = "none";
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No additional images</p>
              )}
            </div>

            {selectedImageForCart && (
              <div className="mt-2 text-sm text-gray-600 text-center">
                <p>Selected image will be used for cart</p>
              </div>
            )}
          </div>

          {/* Right - Details */}
          <div className="text-left">
            <h1 className="text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
            <p className="text-2xl text-black font-bold mb-4">
              ₹{selectedProduct.price?.toLocaleString("en-IN") || "N/A"}
            </p>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-gray-700 font-semibold">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors?.length > 0 ? (
                  selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select ${color} color`}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No colors available</p>
                )}
              </div>
              {selectedColor && (
                <p className="text-sm mt-1 text-gray-600">Selected: {selectedColor}</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-gray-700 font-semibold">Size:</p>
              <div className="flex gap-3 mt-2">
                {selectedProduct.sizes?.length > 0 ? (
                  selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No sizes available</p>
                )}
              </div>
              {selectedSize && (
                <p className="text-sm mt-1 text-gray-600">Selected: {selectedSize}</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="text-gray-700 font-semibold">Quantity</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-4 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-bold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-4 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 text-white font-semibold rounded-lg ${
                isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
              disabled={isButtonDisabled}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
            <ProductGrid products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import ProductGrid from "./ProductGride";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProductDetails,
//   fetchSimilarProducts,
//   resetSelectedProduct,
// } from "../../redux/slices/productsSlice";
// import { addToCart } from "../../redux/slices/cartSlice";

// const ProductDetails = ({ productId }) => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { selectedProduct, products, loading, error, similarProducts } = useSelector(
//     (state) => state.products
//   );
//   const { user, guestId } = useSelector((state) => state.auth);
//   const [mainImage, setMainImage] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [isButtonDisabled, setIsButtonDisabled] = useState(false);

//   const productFetchId = productId || id;

//   useEffect(() => {
//     if (productFetchId) {
//       dispatch(fetchProductDetails(productFetchId));
//       dispatch(fetchSimilarProducts(productFetchId));
//     }
//     return () => {
//       dispatch(resetSelectedProduct());
//     };
//   }, [dispatch, productFetchId]);

//   useEffect(() => {
//     let images = [];

//     if (selectedProduct?.images?.length > 0) {
//       images = selectedProduct.images;
//     } else {
//       const fallbackProduct = products.find(
//         (p) => p._id === productFetchId || p.id === productFetchId
//       );
//       images = fallbackProduct?.images || [];
//     }

//     const validUrls = images
//       .map((img) => img?.url)
//       .filter((url) => typeof url === "string" && url.trim() !== "");

//     if (validUrls.length > 0) {
//       setMainImage(validUrls[0]);
//     } else {
//       setMainImage("");
//     }

//     setSelectedColor("");
//     setSelectedSize("");
//     setQuantity(1);
//   }, [selectedProduct, products, productFetchId]);

//   const handleQuantityChange = (action) => {
//     if (action === "plus") setQuantity((prev) => prev + 1);
//     if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
//   };

//   const handleAddToCart = () => {
//     if (!selectedSize || !selectedColor) {
//       toast.error("Please select a size and color before adding to cart.", {
//         duration: 1000,
//       });
//       return;
//     }
//     setIsButtonDisabled(true);
//     dispatch(
//       addToCart({
//         productId: productFetchId,
//         quantity,
//         size: selectedSize,
//         color: selectedColor,
//         guestId,
//         userId: user?._id,
//       })
//     )
//       .unwrap()
//       .then(() => {
//         toast.success("Product added to the cart!", { duration: 1000 });
//       })
//       .catch((err) => {
//         toast.error(
//           `Failed to add to cart: ${err.message || err || "Unknown error"}`,
//           { duration: 1000 }
//         );
//       })
//       .finally(() => {
//         setIsButtonDisabled(false);
//       });
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!selectedProduct) return <p>Product not found</p>;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left - Image */}
//           <div>
//             <div className="mb-4 overflow-hidden rounded-lg border border-gray-300">
//               {mainImage ? (
//                 <img
//                   src={mainImage}
//                   alt="Main Product"
//                   className="w-full h-96 object-cover transition-all duration-300"
//                   onError={() => setMainImage("")}
//                 />
//               ) : (
//                 <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500">
//                   No image available
//                 </div>
//               )}
//             </div>
//           </div>

//         {/* Right - Details */}
// <div className="text-left">
//   <h1 className="text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
//   <p className="text-2xl text-black font-bold mb-4">
//     ₹{selectedProduct.price}
//   </p>
//   <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

//   {/* Color Selection */}
//   <div className="mb-4">
//     <p className="text-gray-700 font-semibold">Color:</p>
//     <div className="flex gap-2 mt-2">
//       {selectedProduct.colors?.length > 0 ? (
//         selectedProduct.colors.map((color) => (
//           <button
//             key={color}
//             onClick={() => setSelectedColor(color)}
//             className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
//               selectedColor === color
//                 ? "border-black scale-110"
//                 : "border-gray-300 hover:scale-105"
//             }`}
//             style={{ backgroundColor: color.toLowerCase() }}
//           />
//         ))
//       ) : (
//         <p className="text-gray-500">No colors available</p>
//       )}
//     </div>
//   </div>

//   {/* Size Selection */}
//   <div className="mb-4">
//     <p className="text-gray-700 font-semibold">Size:</p>
//     <div className="flex gap-3 mt-2">
//       {selectedProduct.sizes?.length > 0 ? (
//         selectedProduct.sizes.map((size) => (
//           <button
//             key={size}
//             onClick={() => setSelectedSize(size)}
//             className={`px-5 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
//               selectedSize === size
//                 ? "bg-black text-white"
//                 : "hover:bg-gray-200"
//             }`}
//           >
//             {size}
//           </button>
//         ))
//       ) : (
//         <p className="text-gray-500">No sizes available</p>
//       )}
//     </div>
//   </div>

//   {/* Quantity Selector */}
//   <div className="mb-6">
//     <p className="text-gray-700 font-semibold">Quantity</p>
//     <div className="flex items-center space-x-4 mt-2">
//       <button
//         onClick={() => handleQuantityChange("minus")}
//         className="px-4 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300"
//       >
//         -
//       </button>
//       <span className="text-lg font-bold">{quantity}</span>
//       <button
//         onClick={() => handleQuantityChange("plus")}
//         className="px-4 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300"
//       >
//         +
//       </button>
//     </div>
//   </div>

//   {/* Add to Cart */}
//   <button
//     onClick={handleAddToCart}
//     disabled={isButtonDisabled}
//     className={`w-full py-3 bg-black text-white rounded-lg text-lg font-semibold ${
//       isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
//     }`}
//   >
//     {isButtonDisabled ? "Adding..." : "ADD TO CART"}
//   </button>

//   {/* Characteristics */}
//   <div className="mt-10 text-gray-700">
//     <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
//     <table className="w-full text-left text-sm">
//       <tbody>
//         <tr>
//           <td className="py-2 font-medium">Brand</td>
//           <td className="py-2">{selectedProduct.brand || "N/A"}</td>
//         </tr>
//         <tr>
//           <td className="py-2 font-medium">Material</td>
//           <td className="py-2">{selectedProduct.material || "N/A"}</td>
//         </tr>
//       </tbody>
//     </table>
//             </div>
//           </div>
//         </div>

//         {/* Similar Products / Best Sellers */}
//         <div className="mt-20">
//           <h2 className="text-3xl font-semibold text-center mb-8">
//             You May Also Like
//           </h2>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {similarProducts && similarProducts.length > 0 ? (
//               <ProductGrid products={similarProducts} />
//             ) : (
//               <p className="text-center text-gray-500">No similar products found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
