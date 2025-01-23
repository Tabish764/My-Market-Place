'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Logo from '../../../public/Frame1.png';
import Link from 'next/link';
import Search from '../../../public/Auto Layout Horizontal.png';
import Heart from '../../../public/heart.png';
import Cart from '../../../public/cart.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  type NavLink = {
    name: string;
    url: string;
  };

  type Product = {
    id: string;
    productName: string;
  };

  const navLinks: NavLink[] = [
    { name: 'New & Featured', url: '/allproducts' },
    { name: 'Men', url: '/men' },
    { name: 'Women', url: '/women' },
    { name: 'Kids', url: '/kids' },
    { name: 'Sale', url: '/sale' },
    { name: 'SNKRS', url: '/snkrs' },
  ];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.log((error as Error).message);
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
    window.location.href = `/allproducts/${id}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="mx-auto max-w-[1440px] w-full flex justify-between items-center px-4 py-2">
      <Link href={'/'}>
        <Image width={58.85} height={20.54} src={Logo} alt="Nike's Logo" />
      </Link>
      {/* Desktop Navigation */}
      <div className={`md:flex hidden gap-[15px]`}>
        {navLinks.map((item, index) => (
          <p className="text-[15px] font-medium" key={index}>
            <Link href={item.url}>{item.name}</Link>
          </p>
        ))}
      </div>
      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-20 transition-transform transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <button name='close'
          className="absolute top-4 right-4 text-2xl"
          onClick={toggleMobileMenu}
        >
          <FaTimes />
        </button>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {navLinks.map((item, index) => (
            <p className="text-[18px] font-medium" key={index}>
              <Link href={item.url} onClick={toggleMobileMenu}>
                {item.name}
              </Link>
            </p>
          ))}
        </div>
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
          <Link title='cart' href={'/cart'}>
            <Image src={Cart} alt="" />
          </Link>
          <FaBars
            className="block md:hidden text-2xl cursor-pointer"
            onClick={toggleMobileMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
