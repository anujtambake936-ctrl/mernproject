import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import Loader from '../components/Loader';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [active,setActive] = useState(0)
  const [categories, setCategories] = useState(["All", "beauty", "fragrances", "furniture", "groceries"])


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      const res = await fetch(`${serverUrl}/api/products`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        // Fallback to dummyjson if database is empty
        const fallbackRes = await fetch(`https://dummyjson.com/products`);
        const fallbackData = await fallbackRes.json();
        setProducts(fallbackData.products);
        setFilteredProducts(fallbackData.products);
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        // Transform database products to match expected format
        const transformedProducts = data.products.map(product => ({
          id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          thumbnail: product.thumbnail,
          images: product.images.length > 0 ? product.images : [product.thumbnail],
          stock: product.stock,
          rating: product.rating,
          brand: product.brand
        }));
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      }
    } catch (error) {
      console.log(error);
      // Fallback to dummyjson on error
      try {
        const fallbackRes = await fetch(`https://dummyjson.com/products`);
        const fallbackData = await fallbackRes.json();
        setProducts(fallbackData.products);
        setFilteredProducts(fallbackData.products);
      } catch (fallbackError) {
        console.log(fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (category,index) => {
    setCategory(category);
    setActive(index)
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      const res = await fetch(`${serverUrl}/api/products/categories`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setCategories(["All", ...data.categories]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (products.length === 0) {
    return <p>Please connect to the internet.</p>;
  }

  return (
    <section className='min-h-screen w-full'>
     
      <div className="container p-5 mx-auto">
      <div className='flex gap-5 items-center justify-start overflow-x-scroll mb-10'>
        {categories.map((cat, index) => (
          <button 
            key={index} 
            className={`border px-4 py-1 rounded-lg  min-w-fit ${index== active ? 'bg-green-500 text-white':''}` }
            onClick={() => handleClick(cat === "All" ? "All" : cat, index)}
          >
            {cat}
          </button>
        ))}
      </div>
        <div className="flex flex-wrap -m-4">
          {filteredProducts?.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
