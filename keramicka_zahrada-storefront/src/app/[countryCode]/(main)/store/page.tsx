import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import ECom from "@modules/store/Shop"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <main>
      {/* <ECom 
        // WIP: Search how to integrate the ECom component into the medusa system 
        // Get the Items from the database product, use the categories and collections for the category componet 
        // use searchBar to filter the products by price, name, category, newest, etc, even by best selling if that is possible within medusa
        // Reorganize the product list compnent to use the medusa system and craete more smaller components out of it for the page
        // remove all unnesseary pages and components at the end from the repo one everything is done and working
        // As last step: integrate sanity and craete custom plugin for it for the admin to manage sanity and medusa together
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      /> */}
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </main>
  )
}
