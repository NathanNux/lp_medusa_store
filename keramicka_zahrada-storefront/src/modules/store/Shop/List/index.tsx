"use client";
import Image from "next/image";
import { ProductType } from "..";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type ProductListProps = {
    products: ProductType[];
}

export default function ProductList({products}: ProductListProps) {
    const [ visibleProducts, setVisibleProducts ] = useState<number>(15);

    useEffect(() => {
        function handleScroll() {
            if(
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                visibleProducts < products.length
            ) {
                setVisibleProducts((prev) => Math.min(prev + 15, products.length));
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [visibleProducts, products.length]);

    useEffect(() => {
        // Reset visible products when products change
        setVisibleProducts(15);
        const scrollToTop = () => {
            window.scrollTo({
                top: 25,
                behavior: "smooth"
            });
        }
        scrollToTop();
    }, [products]);
    return (
        <div className="product__list">
            <div className="product__list__items">
                <AnimatePresence>
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="product__list__item"
                            layout
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Link href={`/eshop/${product.id}`} className="product__link">
                                <div className="product__image__container">
                                    <Image 
                                        src={product.src}
                                        alt={product.alt}
                                        width={200}
                                        height={200}
                                        className="product__image"
                                        loading="lazy"
                                        quality={75}
                                        placeholder="blur"
                                        blurDataURL={product.src} // Assuming src is a valid base64 or URL for the placeholder
                                    />
                                </div>
                                <div className="product__title__color_container">
                                    <h3 className="product__name">{product.name}</h3>
                                    <div className="product__color__container">
                                        {product.colors.map((color, index) => (
                                            <div 
                                                key={index} 
                                                className="product__color"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="product__desc__container">
                                    <p className="product__desc">{product.desc}</p>
                                    {product.new && <span className="product__new">Novinka</span>}
                                </div>
                                <div className="product__price__container">
                                    <p 
                                        className="product__price"
                                        // to Fixed is used to format the price to decimal places like 349.99
                                    >
                                        {product.price.toFixed(0)} Kč
                                    </p>
                                    <div className="product__sale__container">
                                        <button className="add__to__cart__button">
                                            <Image 
                                                src="/assets/icons/bookmark.svg"
                                                alt="Add to Cart Icon"
                                                width={24}
                                                height={24}
                                                className="add__to__cart__icon"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}