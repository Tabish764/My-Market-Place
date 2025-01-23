'use client'


import arrow1 from '../../../public/arrow1.png';
import arrow2 from '../../../public/arrow2.png';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-[84px] max-w-[1440px] mx-auto flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 lg:px-12">
        <h1 className="font-medium text-lg md:text-xl lg:text-2xl pb-3 leading-6 md:leading-8 pt-3">
          Best of Air Max
        </h1>
        <div className="flex items-center gap-3">
          <p className="font-medium text-sm md:text-base leading-6">Shop</p>
          <button onClick={scrollLeft}>
            <Image className="w-8 h-8 md:w-12 md:h-12" src={arrow1} alt="Scroll Left" />
          </button>
          <button onClick={scrollRight}>
            <Image className="w-8 h-8 md:w-12 md:h-12" src={arrow2} alt="Scroll Right" />
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div ref={scrollContainer} className="flex gap-4 px-6 lg:px-12 pt-6 overflow-x-hidden snap-x snap-mandatory scrollbar-hide">
        {/* Display loading or error message */}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {/* Product Item */}
        {products && products.length > 0 ? (
          products.map((item) => (
            <div key={item.id} className="min-w-[200px] md:min-w-[300px] lg:min-w-[400px] snap-center flex-shrink-0">
              <Link href={`allproducts/${item.id}`}>
              
              <Image width={441} height={441} className="w-full h-auto rounded-lg" src={item.imageUrl} alt={`Nike Product`} />
              </Link>
              <p className="flex justify-between pt-4 text-sm md:text-base font-medium leading-6">
                {item.productName} <span>{item.price}</span>
              </p>
              <p className="text-sm text-gray-500">Men&apos;s Shoes</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Products;
