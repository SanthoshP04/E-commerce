import React from 'react';
import vaction from '../../assets/vaction.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className='relative w-full min-h-screen overflow-hidden'>
            {/* Background Image */}
            <img
                src={vaction}
                alt="Vacation"
                className='w-full h-full object-cover absolute inset-0'
                style={{ minHeight: '100vh' }} // Ensure the image covers the full viewport height
            />

            {/* Overlay */}
            <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
                <div className='text-center text-white p-4 md:p-8 max-w-4xl'>
                    {/* Heading */}
                    <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter uppercase mb-4'>
                        Vacation <br className='hidden sm:block' />Ready
                    </h1>

                    {/* Subheading */}
                    <p className='text-lg sm:text-xl md:text-2xl mb-8'>
                        Explore our vacation-ready outfits with fast worldwide shipping.
                    </p>

                    {/* Shop Now Button */}
                    <Link
                        to="#"
                        className='bg-white text-gray-800 px-6 py-3 rounded-sm text-lg font-semibold hover:bg-gray-100 transition-all'
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;