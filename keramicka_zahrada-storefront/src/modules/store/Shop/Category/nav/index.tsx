"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import style from "./styles.module.scss"; 

type CategoryProps = {
    category: string;
    setCategoryAction: (c: string) => void;
    categories?: string[];
};

// Mobile Category Nav Component (similar to navbar Nav)
export default function CategoryNav({ category, setCategoryAction, categories }: CategoryProps) {
    const perspective = {
        initial: {
            opacity: 0,
            rotateX: 90,
            translateY: 80,
            translateX: -20,
        },
        enter: (i: number) => ({
            opacity: 1,
            rotateX: 0,
            translateY: 0,
            translateX: 0,
            transition: {
                duration: 0.65, 
                delay: 0.5 + (i * 0.1), 
                ease: [.215,.61,.355,1],
                opacity: { duration: 0.35}
            }
        }),
        exit: {
            opacity: 0,
            transition: { duration: 0.5, type: "linear", ease: [0.76, 0, 0.24, 1]}
        }
    }

    const handleCategoryClick = (cat: string) => {
        if (category === cat) {
            setCategoryAction("");
        } else {
            setCategoryAction(cat);
        }
    }

    return (
        <div className={style.navCat}>
            <div className={style.bodyCat}>
                {categories?.map((cat, i) => (
                    <div key={`cat_${i}`} className={style.linkContainerCat}>
                        <motion.div
                            custom={i}
                            variants={perspective}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                            className={`${style.category__nav__item} ${category === cat ? "active" : ""}`}
                            onClick={() => handleCategoryClick(cat)}
                            style={{
                                backgroundColor: category === cat ? "var(--CharcoalBg)" : "var(--WhiteBg)",
                            }}
                        >
                            <p
                                style={{
                                    color: category === cat ? "var(--WhiteBg)" : "var(--ChText)",
                                }}
                            >
                                {cat}
                            </p>
                            <motion.div className={style.category__icon}
                                initial={{ rotate: 0 }}
                                animate={{ rotate: category === cat ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    borderColor: category === cat ? "var(--WhiteBg)" : "var(--ButtonBorder)",
                                }}
                            >
                                <AnimatePresence>
                                    {category === cat && (
                                        <Image 
                                            src="/assets/icons/arrow_up_white.svg"
                                            alt="arrow up icon" 
                                            width={20} 
                                            height={20} 
                                            className="arrow__icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCategoryAction("");
                                            }}
                                        />
                                    )}
                                    {category !== cat && (
                                        <Image 
                                            src="/assets/icons/arrow_up.svg"
                                            alt="arrow right icon" 
                                            width={20} 
                                            height={20} 
                                            className={style.arrow__icon}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setCategoryAction("");
                                            }}
                                        />
                                    )}
                                </AnimatePresence>   
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}
