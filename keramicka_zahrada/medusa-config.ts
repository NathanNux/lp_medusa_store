import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    storefrontUrl: process.env.MEDUSA_STOREFRONT_URL || "http://localhost:8000",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  projectConfig: {
    
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/comgate",
            id: "comgate",
          },
        ],
        merchant: "497113",
        secret: "VnQ7tNhYZZCQRJeuUb6MDDqfNmnmYzIo",
        test: true,
        country: "CZ",
        curr: "CZK",
      }
    },
    {
      resolve: "./src/modules/sanity",
      options: {
        api_token: process.env.SANITY_API_TOKEN,
        project_id: process.env.SANITY_PROJECT_ID,
        api_version: new Date().toISOString().split("T")[0],
        dataset: "production",
        studio_url: process.env.SANITY_STUDIO_URL || 
          "http://localhost:3000/studio",
        type_map: {
          product: "product",
        },
      },
    },
    {
      resolve: "./src/modules/wishlist",
    },
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "./src/modules/segment",
            id: "segment",
            options: {
              writeKey: process.env.SEGMENT_WRITE_KEY || "",
            },
          },
        ],
      },
    }, 
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "./src/modules/ceskaPostaFulfillment",
            id: "ceska-posta-fulfillment",
            options: {
              // Add any specific options for the fulfillment provider here
            },
          },
          {
            resolve: "./src/modules/zasilkovnaFulfillment",
            id: "packeta",
            options: {
              // Add any specific options for the fulfillment provider here
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/algolia",
      options: {
        appId: process.env.ALGOLIA_APP_ID!,
        apiKey: process.env.ALGOLIA_API_KEY!,
        productIndexName: process.env.ALGOLIA_PRODUCT_INDEX_NAME!,
      }
    },
    {
      resolve: "./src/modules/product-review",
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/restock"
    },
    {
      resolve: "./src/modules/bundled-product",
    },
  ]
})
