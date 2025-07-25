"use client";
import { useEffect, useState } from "react";
import Categories from "./Category";
import ProductList from "./List";
import NewsLetter from "./NewsLetter";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { productsList } from "constants/products";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"


export type ProductType = {
  id: number;
  src: string;
  alt: string;
  category: string;
  name: string;
  desc: string;
  new: boolean;
  price: number;
  sale: {
    state: boolean;
    price: number;
    damage: string | null;
  };
  sizes: string[];
  colors: string[];
};

export type FilterState = {
  category: string;
  search: string;
  priceRange: string;
  sale: boolean;
  isNew: boolean;
};



const ECom = ({ 
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
    const [category, setCategory] = useState<FilterState["category"]>("");
    const [pendingCategory, setPendingCategory] = useState<FilterState["category"]>("");
    const [search, setSearch] = useState<FilterState["search"]>("");
    const [priceRange, setPriceRange] = useState<FilterState["priceRange"]>("");
    const [sale, setSale] = useState<FilterState["sale"]>(false);
    const [isNew, setIsNew] = useState<FilterState["isNew"]>(false);

    const categories = Array.from(new Set(productsList.map(product => product.category)));
    
    const priceRangeDefs = [
      { min: 0, max: 299, label: "0 - 300" },
      { min: 300, max: 499, label: "300 - 500" },
      { min: 500, max: 999, label: "500 - 1 000" },
      { min: 1000, max: 2499, label: "1 000 - 2 500" },
      { min: 2500, max: Infinity, label: "2 500+" },
    ];
    
    const priceRanges = priceRangeDefs
    .filter(range =>
        productsList.some(product =>
            product.price >= range.min && product.price <= range.max
        )
        )
    .map(range => range.label);
    

    // Filtering logic
    let filteredProducts = productsList as ProductType[];

    if(category) {
        filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    if(priceRange) {
        const [min, max] = priceRange
            .split("-")
            .map(s => Number(s.replace(/\s/g, "")));
        filteredProducts = filteredProducts.filter(product => 
            product.price >= min && product.price <= max
        );
    }

    if(sale) {
        filteredProducts = filteredProducts.filter(product => product.sale.state);
    }

    if(isNew) {
        filteredProducts = filteredProducts.filter(product => product.new);
    }

    if(search) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        );
    }

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

    // On any filter change, save to localStorage
    useEffect(() => {
        localStorage.setItem(
            "shopFilters",
            JSON.stringify({ category, search, priceRange, sale, isNew })
        );
    }, [category, search, priceRange, sale, isNew]);
  

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
        <ProductList products={filteredProducts} />
        <NewsLetter />
        <div className="ecom__scroll__to__top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth"
            })}
        >
            <button
                className="scroll__to__top__button"
            >
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