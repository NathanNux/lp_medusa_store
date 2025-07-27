"use client";
import { useEffect, useMemo, useState } from "react";
import Categories from "./Category";
import ProductList from "./List";
import NewsLetter from "./NewsLetter";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types";
import { sdk } from "@lib/config";
import { getProductPrice } from "@lib/util/get-product-price";

type EComProps = {
  sortBy?: SortOptions
  page?: number
  countryCode: string
  products: HttpTypes.StoreProduct[]
  totalPages: number
  categories?: HttpTypes.StoreProductCategory[]
}


const PRODUCT_LIMIT = 15

const priceRangeDefs = [
  { min: 0, max: 300, label: "0 - 300" },
  { min: 301, max: 500, label: "301 - 500" },
  { min: 501, max: 1000, label: "501 - 1 000" },
  { min: 1001, max: 2500, label: "1 001 - 2 500" },
  { min: 2501, max: Infinity, label: "2 501+" },
];

const ECom = ({
  sortBy,
  page = 1,
  countryCode,
  products,
  totalPages,
  categories = [],
}: EComProps) => {
  // Filter states
  const [category, setCategory] = useState("");
  const [pendingCategory, setPendingCategory] = useState("");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sale, setSale] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Get all unique categories from products

  // products.map(product => { 
  //   product.categories?.map(cat => {
  //     cat.category_children.map(child => {
  //       child.
  //     })
  //   })
  // })

  // Filtering logic// Enrich products with price info
  const enrichedProducts = useMemo(() =>
    products.map(product => {
      const { cheapestPrice } = getProductPrice({ product });
      return {
        ...product,
        cheapestPrice,
      };
    })
  , [products]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let result = enrichedProducts;
    if (category) {
      // Find the selected category object
      const selectedCategory = categories.find(cat => cat.name === category);
      if (selectedCategory && Array.isArray(selectedCategory.products) && selectedCategory.products.length > 0) {
        const categoryProductIds = selectedCategory.products.map(p => p.id);
        result = result.filter(product => categoryProductIds.includes(product.id));
      } else {
        result = [];
      }
    }
    if (priceRange) {
      const rangeDef = priceRangeDefs.find(r => r.label === priceRange);
      if (!rangeDef) return []; // If not found, return no products
      // Filter products by price range
      result = result.filter(product => {
        const price = Number(product.cheapestPrice?.calculated_price_number ?? NaN);
        if (isNaN(price)) return false;
        // Use inclusive min, exclusive max except for Infinity
        if (rangeDef.max === Infinity) {
          return price >= rangeDef.min;
        }
        return price >= rangeDef.min && price <= rangeDef.max;
      });
    }
    if (sale) {
      result = result.filter(product =>
        product.cheapestPrice?.price_type === "sale"
      );
    }
    if (isNew) {
      result = result.filter(product => product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    }
    if (search) {
      result = result.filter(product =>
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.categories?.some(cat =>
          cat.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return result;
  }, [enrichedProducts, category, priceRange, sale, isNew, search]);

  // Pagination logic (client-side)
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((page - 1) * PRODUCT_LIMIT, page * PRODUCT_LIMIT);
  }, [filteredProducts, page]);

  // Scroll pagination (if you use infinite scroll)
  const [visibleProducts, setVisibleProducts] = useState(PRODUCT_LIMIT);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        visibleProducts < paginatedProducts.length
      ) {
        setVisibleProducts((prev) => Math.min(prev + PRODUCT_LIMIT, paginatedProducts.length));
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleProducts, paginatedProducts.length]);

  useEffect(() => {
    setVisibleProducts(PRODUCT_LIMIT);
    window.scrollTo({ top: 25, behavior: "smooth" });
  }, [paginatedProducts]);

  // Show all price ranges in the UI
  const priceRanges = priceRangeDefs.map(range => range.label);

  useEffect(() => {
    const saved = localStorage.getItem("shopFilters");
    if (saved) {
      const { category, search, priceRange, sale, isNew } = JSON.parse(saved);
      setCategory(category || "");
      setSearch(search || "");
      setPriceRange(priceRange || "");
      setSale(sale || false);
      setIsNew(isNew || false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "shopFilters",
      JSON.stringify({ category, search, priceRange, sale, isNew })
    );
  }, [category, search, priceRange, sale, isNew]);


  console.log("product categories:", products.map(p => p.categories?.map(c => c.name)));

  return (
    <section className="ecom">
      <SearchBar
        category={category}
        setCategoryAction={setCategory}
        search={search}
        setSearchAction={setSearch}
        priceRange={priceRange}
        setPriceRangeAction={setPriceRange}
        sale={sale}
        setSaleAction={setSale}
        isNew={isNew}
        setIsNewAction={setIsNew}
        priceRanges={priceRanges}
        categories={categories}
        pendingCategory={pendingCategory}
        setPendingCategoryAction={setPendingCategory}
      />
      <Categories
        category={category}
        setCategoryAction={setCategory}
        categories={categories}
      />
      <ProductList
        products={paginatedProducts}
        countryCode={countryCode}
      />
      <NewsLetter />
      <div className="ecom__scroll__to__top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <button className="scroll__to__top__button">
          <Image
            src="/assets/icons/arrow_up_white.svg"
            alt="Scroll to top icon"
            width={20}
            height={20}
            className="scroll__to__top__icon"
            aria-label="Scroll to top"
          />
        </button>
      </div>
    </section>
  );
}

export default ECom