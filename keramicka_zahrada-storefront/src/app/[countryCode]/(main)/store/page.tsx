import ECom from "@modules/store/Shop"
import { listProductsWithSort } from "@lib/data/products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listCategories } from "@lib/data/categories"
import { c } from "framer-motion/dist/types.d-Bq-Qm38R"

export default async function StorePage({ params, searchParams }: { params: { countryCode: string }, searchParams: { sortBy?: SortOptions, page?: string } }) {
  const countryCode = params.countryCode
  const sortBy = searchParams.sortBy || "created_at"
  const page = Number(searchParams.page) || 1
  const PRODUCT_LIMIT = 15

  // Fetch all products (or you can fetch only the current page for huge catalogs)
  const { response: { products, count } } = await listProductsWithSort({
    page,
    queryParams: {
      order: sortBy,
      limit: 1000, // fetch all, or set a high enough limit
    },
    sortBy,
    countryCode,
  })

  // Fetch all categories (with products)
  const categories = await listCategories({
    fields: "*category_children, *products, *parent_category, *parent_category.parent_category",
    limit: 100,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  console.log("Fetched products:", products, "Total count:", count)
  console.log("Fetched categories + all of their products:", categories)

  return (
    <ECom
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      products={products}
      totalPages={totalPages}
      categories={categories}
    />
      // <StoreTemplate
      //   sortBy={sortBy}
      //   page={currentPage}
      //   countryCode={params.countryCode}
      // />
    
  )
}