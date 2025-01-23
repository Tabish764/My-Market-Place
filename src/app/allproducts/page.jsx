"use client";
import React, { useEffect, useState } from "react";
import filter from "../../../public/setting.png";
import silde from "../../../public/Frame (2).png";
import up from "../../../public/up.png";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filters
  const [genderFilter, setGenderFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (genderFilter.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        genderFilter.includes(product.category)
      );
    }

    if (priceFilter) {
      if (priceFilter === "under2500") {
        updatedProducts = updatedProducts.filter(
          (product) => product.price <= 2500
        );
      } else if (priceFilter === "2501to5000") {
        updatedProducts = updatedProducts.filter(
          (product) => product.price > 2500 && product.price <= 5000
        );
      }
    }

    setFilteredProducts(updatedProducts);
  }, [genderFilter, priceFilter, products]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleGenderChange = (category) => {
    setGenderFilter((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (priceRange) => {
    setPriceFilter(priceRange === priceFilter ? null : priceRange);
  };

  return (
    <div className="mx-auto max-w-[1440px] w-full pt-[76px]">
      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-6 h-6 border-t-4 border-t-black-500 border-gray-200 rounded-full animate-spin"></div>
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <p className="text-red-500 font-bold items-center justify-center flex text-4xl">
          {error}
        </p>
      )}

      <div className="pb-[30px]  flex justify-between">
        <h1 className="font-medium text-[24px]">
          New ({filteredProducts.length})
        </h1>
        <div className="flex justify-between items-center gap-[25px]">
          <p className="text-[16px] text-center flex gap-2 items-center ">
            Hide Filters{" "}
            <span>
              <Image src={filter} alt="" />
            </span>
          </p>
          <p className="text-[16px] text-center">Sort By</p>
        </div>
      </div>

      <div className="flex lg:flex-row items-center lg:items-start flex-col justify-between">
        <div className="w-[260px]">
          <div className="justify-between ">
            <div className="max-w-[260px] flex-col flex justify-between">
              <div className="text-[15px] w-full font-medium">
                <p className="mb-[14.59px]">Shoes</p>
                <p className="mb-[14.59px]">Sports Bras</p>
                <p className="mb-[14.59px]">Tops & T-Shirts</p>
                <p className="mb-[14.59px]">Hoodies & Sweatshirts</p>
                <p className="mb-[14.59px]">Jackets</p>
                <p className="mb-[14.59px]">Tracksuits</p>
                <p className="mb-[14.59px]">Jumpsuits & Rompers</p>
                <p className="mb-[14.59px]">Skirts & Dresses</p>
                <p className="mb-[14.59px]">Socks</p>
                <p>
                  Accessories <br />& Equipment
                </p>
                <hr className="w-[100%] mt-[40px]" />
              </div>
              <div className="text-[15px] w-full font-medium">
                {/* Gender Filter */}
                <div className="flex pt-[28px] justify-between items-center">
                  <h1 className="text-[16px] font-medium">Gender</h1>
                  <Image src={up} alt="" />
                </div>
                <div className="flex pt-[21px] gap-[6px]">
                  <input
                    type="checkbox"
                    onChange={() => handleGenderChange("Men's Shoes")}
                  />
                  <p>Men</p>
                </div>
                <div className="flex pt-[4px] gap-[6px]">
                  <input
                    type="checkbox"
                    onChange={() => handleGenderChange("Women's Shoes")}
                  />
                  <p>Women</p>
                </div>
                <div className="flex pt-[4px] gap-[6px]">
                  <input
                    type="checkbox"
                    checked={genderFilter.includes("Unisex")}
                    onChange={() => handleGenderChange("Unisex")}
                  />
                  <p>Unisex</p>
                </div>

                {/* Price Filter */}
                <div className="flex pt-[28px] justify-between items-center">
                  <h1 className="text-[16px] font-medium">Shop By Price</h1>
                  <Image src={up} alt="" />
                </div>
                <div className="flex pt-[11px] gap-[6px]">
                  <input
                    type="checkbox"
                    checked={priceFilter === "under2500"}
                    onChange={() => handlePriceChange("under2500")}
                  />
                  <p>Under ₹ 2 500.00</p>
                </div>
                <div className="flex pt-[4px] gap-[6px]">
                  <input
                    type="checkbox"
                    checked={priceFilter === "2501to5000"}
                    onChange={() => handlePriceChange("2501to5000")}
                  />
                  <p>₹ 2 501.00 - ₹ 5 000.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className="flex flex-col flex-wrap pb-[142px] justify-center gap-[12px] w-[75%]">
          <div className="flex flex-wrap justify-center gap-[12px]">
            {currentProducts.map((item, index) => (
              <div key={index} className="pb-[40px]">
                <Link href={`allproducts/${item.id}`}>
                  <Image src={item.imageUrl} width={348} height={348} alt="" />
                </Link>
                <p className="text-[15px] font-medium text-[#9E3500]">
                  {item.status}
                </p>
                <p>{item.name}</p>
                <p className="text-[15px] text-[#757575]">{item.productName}</p>
                <p className="text-[#757575] font-medium">{item.colors}</p>
                <p className="pt-[19px] font-medium">MRP : ₹ {item.price}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="py-2 px-4 border rounded"
              >
                Previous
              </button>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`py-2 px-4 border rounded ${currentPage === index + 1 ? "bg-black text-white" : ""}`}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="py-2 px-4 border rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
