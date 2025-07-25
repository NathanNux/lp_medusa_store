import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"


export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  return (
      <div className="product__details__cta__price">
          <p>Cena |</p>
          <div className="product__details__cta__price__main">
              <span
                  className="text-xl-semi"
                  data-testid="product-price"
                  data-value={variantPrice?.calculated_price_number || cheapestPrice?.calculated_price_number}
              >
                  {!variant && "Z "}
                  {variantPrice?.calculated_price || cheapestPrice?.calculated_price}
              </span>
              {variantPrice?.price_type === "sale" && (
                  <p>
                      <span className="text-ui-fg-subtle">Původní cena: </span>
                      <span
                          className="line-through"
                          data-testid="original-product-price"
                          data-value={variantPrice.original_price_number}
                      >
                          {variantPrice.original_price}
                      </span>
                  </p>
              )}
              {variantPrice?.price_type === "sale" && (
                  <span className="text-ui-fg-interactive">
                      -{variantPrice.percentage_diff}%
                  </span>
              )}
              {cheapestPrice && !variantPrice && (
                  <span
                      className="text-ui-fg-base"
                      data-testid="cheapest-product-price"
                      data-value={cheapestPrice.calculated_price_number}
                  >
                      {cheapestPrice.calculated_price}
                  </span>
              )}
          </div>
      </div>
  )
}