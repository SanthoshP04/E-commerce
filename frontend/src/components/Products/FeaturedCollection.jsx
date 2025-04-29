import React from 'react';
import { Link } from 'react-router-dom';
import featured from '../../assets/featured.webp'; // Corrected image import

const FeaturedCollection = () => {
    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-gray-100 rounded-3xl overflow-hidden'>
                {/* Left Content */}
                <div className='lg:w-1/2 p-8 text-center lg:text-left'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                        Comfort and Style
                    </h2>
                    <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
                        Apparel made for your everyday life
                    </h2>
                    <p className='text-lg text-gray-600 mb-6'>
                        Clothing is more than just fabric—it’s a way to express yourself, showcase your
                        personality, and feel confident in every moment. Whether you’re looking for timeless
                        classics like crisp white tees and tailored jeans, or trendy pieces like oversized
                        sweaters and flowy midi skirts, our collection has something for everyone.
                    </p>
                    <Link 
                        to='/collections/all' 
                        className='inline-block bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-colors'
                    >
                        Shop Now
                    </Link>
                </div>

                {/* Right Content */}
                <div className='lg:w-1/2'>
                    <img 
                        src={featured} 
                        alt="Featured Collection" 
                        className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl'
                    />
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollection;