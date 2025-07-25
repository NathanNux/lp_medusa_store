"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryNav from "./nav";
import CategoryButton from "./button";

type CategoryProps = {
    category: string;
    setCategoryAction: (c: string) => void;
    categories?: string[];
};

export default function Categories({ category, setCategoryAction, categories }: CategoryProps) {
    const [isMobile, setIsMobile] = useState(true);
    const [isActive, setIsActive] = useState(false);

    // Mobile menu animation
    const menu = {
        open: {
            width: "90vw",
            height: "65vh",
            top: "1vh",
            left: "2vw",
            transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1]}
        },
        closed: {
            width: "50px",
            height: "50px",
            top: "1vh",
            left: "2vw",
            transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1]}
        }
    }

    // useEffect(() => {
    //     const updateDimensions = () => {
    //         const width = window.innerWidth;
    //         const height = window.innerHeight;
            
    //         // Check if mobile (width smaller than height AND width below 550px)
    //         const isMobileDevice = width < height && width < 550;
    //         setIsMobile(isMobileDevice);
    //     };

    //     // Run on mount
    //     updateDimensions();

    //     // Add resize listener
    //     window.addEventListener('resize', updateDimensions);

    //     // Cleanup listener on unmount
    //     return () => {
    //         window.removeEventListener('resize', updateDimensions);
    //     };
    // }, []);

    // const handleCategoryClick = (cat: string) => {
    //     if (category === cat) {
    //         setCategoryAction("");
    //     } else {
    //         setCategoryAction(cat);
    //     }
    // }

    return (
        <div className="categories">
            {/* {!isMobile && (
                // Desktop & Tablet Category List
                <div className="categories__container">
                    <div className="categories__title">
                        <h3>Kategorie</h3>
                    </div>
                    <div className="categories__list">
                        <ul>
                            {categories?.map((cat) => (
                                <li 
                                    key={cat} 
                                    className={category === cat ? "active" : ""}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    <p>{cat}</p>
                                    <motion.div className="category__icon"
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: category === cat ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Image 
                                            src="/assets/icons/arrow_up.svg" 
                                            alt="arrow right icon" 
                                            width={20} 
                                            height={20} 
                                            className="arrow__icon"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setCategoryAction("");
                                            }}
                                        />   
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )} */}

            {isMobile && (
                // Mobile Category Menu
                <div className="categories__mobile">
                    <motion.div 
                        className="categories__mobile__menu"
                        variants={menu}
                        animate={isActive ? "open" : "closed"}
                        initial="closed"
                    >
                        <AnimatePresence>
                            {isActive && (
                                <CategoryNav 
                                    category={category}
                                    setCategoryAction={setCategoryAction}
                                    categories={categories}
                                />
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {isActive && (
                                <motion.div className="categories__mobile__button__confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 , transition: { delay: 0.5}}} exit={{ opacity: 0 }}>
                                    <button className="confirm__button" onClick={() => setIsActive(false)}>
                                        <p>Potvrdit</p>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <CategoryButton 
                        isActive={isActive} 
                        toggleMenu={() => setIsActive(!isActive)}
                    />
                </div>
            )}
        </div>
    );
}