"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import cart from "../../../../public/Buy 2.png";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { toast } from "react-toastify";

interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
  image: string;
  category: string;
}

const Page: React.FC = () => {
  const { id } = useParams() as { id: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product data");

        const data: Product = await res.json();
        setProduct(data);

        const relatedRes = await fetch(
          `/api/products`
        );
        if (!relatedRes.ok) throw new Error("Failed to fetch related products");

        const relatedData: Product[] = await relatedRes.json();
        const filteredRelated = relatedData.filter(
          (item) => item.category === data.category && item.id !== data.id
        );
        setRelatedProducts(filteredRelated);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center space-x-2">
        <div className="w-[10rem] h-[10rem] border-t-[0.5rem] border-t-black-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleAddToCart = () => {
    addToCart(product as any);

    toast.success(`${product.productName} has been added to your cart!`, {
      position: "top-right",
      autoClose: 1000,
    });
  };

  return (
    <>
      <div className="max-w-[1440px] mx-auto pb-[100px] mt-[158px] flex flex-wrap gap-[50px] lg:gap-[130px] justify-center lg:justify-start lg:pl-[98px]">
        {/* Product Image */}
        <div className="flex justify-center w-full lg:w-auto">
          <Image
            width={653}
            height={653}
            className="px-5 lg:px-0"
            src={product.image as any}
            alt={product.productName}
          />
        </div>

        {/* Product Details */}
        <div className="max-w-[376px] w-full text-center lg:text-left">
          <h1 className="font-medium text-[28px] lg:text-[48px] leading-[48px]">
            {product.productName}
          </h1>
          <p className="font-400 lg:text-[15px] text-[10px] lg:leading-[28px] leading-[18px] pt-[34px]">
            {product.description}
          </p>
          <h1 className="text-[36px] leading-[28px] font-medium mt-[32px]">
            ₹ {product.price}
          </h1>

          {/* Add to Cart Button */}
          <div className="bg-black rounded-[30px] text-white mt-[26px] flex items-center justify-center gap-[10px] py-[7.5px] px-[22.5px] w-[174.42px] mx-auto lg:mx-0">
            <Image src={cart} alt="Cart Icon" />
            <button className="text-[15px]" onClick={handleAddToCart}>
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-[1440px] flex flex-col items-center justify-center mx-auto mt-[80px]">
        <h2 className="text-[24px] font-medium">Related Products</h2>
        <div className="flex gap-[20px] pb-5 items-center justify-center flex-wrap mt-[30px]">
          {relatedProducts.map((item) => (
            <div key={item.id} className="max-w-[280px]">
              <Link href={`/allproducts/${item.id}`}>
                <Image
                  src={item.imageUrl}
                  width={280}
                  height={280}
                  alt={item.productName}
                />
              </Link>
              <h3 className="text-[15px] font-medium mt-[10px]">
                {item.productName}
              </h3>
              <p className="text-[14px] text-[#757575]">{item.description}</p>
              <h4 className="text-[20px] font-medium mt-[10px]">
                ₹ {item.price}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
