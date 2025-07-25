import { HttpTypes } from "@medusajs/types";

import styles from "./style.module.scss";

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const Title = ({ product }: ProductInfoProps) => {
    // WIP: later add to the product data structure a function to click on the category or the collection, go to store and filter by that category or collection 
  return (
    <div className={styles.title__Container}>
        <div className={styles.handle}>
            { product.categories && (
                <p>
                    {product.categories.map(( cat ) => (
                        <span key={cat.id} >
                            {cat.name || cat.handle}
                        </span>
                    ))}
                </p>
            )}
        </div>
        <div className={styles.title}>
            <h2>{product.title}</h2>
        </div>
    </div>
  );
};

export default Title;