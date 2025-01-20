import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Logo from '../../../public/Frame1.png';
import Link from 'next/link';
import Search from '../../../public/Auto Layout Horizontal.png';
import Heart from '../../../public/heart.png';
import Cart from '../../../public/cart.png';
import { FaBars } from 'react-icons/fa';

const Navbar = () => {
  type NavLink = {
    name: string;
    url: string;
  };

  const navLinks: NavLink[] = [
    { name: 'New & Featured', url: '/allproducts' },
    { name: 'Men', url: '/men' },
    { name: 'Women', url: '/women' },
    { name: 'Kids', url: '/kids' },
    { name: 'Sale', url: '/sale' },
    { name: 'SNKRS', url: '/snkrs' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products'); // Replace with your API endpoint
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [searchQuery, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (id: string) => {
    setSearchQuery('');
    setIsDropdownVisible(false);
    window.location.href = `/allproducts/${id}`; // Navigate to the product's page
  };

  return (
    <div className="mx-auto max-w-[1440px] w-full flex justify-between items-center">
      <Link href={'/'}>
        <Image
          width={58.85}
          height={20.54}
          className=""
          src={Logo}
          alt="Nike's Logo"
        />
      </Link>
      <div className="md:flex hidden gap-[15px]">
        {navLinks.map((item, index) => (
          <p className="text-[15px] font-medium" key={index}>
            <Link href={item.url}>{item.name}</Link>
          </p>
        ))}
      </div>
      <div className="flex items-center">
        <div className="flex items-center border rounded-full bg-[#F5F5F5] relative w-full max-w-[180px]">
          <input
            className="bg-transparent rounded-full pl-[48px] pr-4 py-[8px] placeholder:text-[#CCCCCC] placeholder:font-medium text-[#111111] w-full focus:outline-none focus:ring-2 focus:ring-[#000000]/50"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute left-2">
            <Image src={Search} alt="Search Icon" />
          </div>
          {/* Dropdown for search results */}
          {isDropdownVisible && (
            <div className="absolute top-[100%] left-0 w-full bg-white border shadow-lg rounded-lg z-10 max-h-[200px] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.productName}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 pl-[12px]">
          <Image src={Heart} alt="" />
          <Link href={'/cart'}>
            <Image src={Cart} alt="" />
          </Link>
          <FaBars className="block md:hidden" size={25} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
