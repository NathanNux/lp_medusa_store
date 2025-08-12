import { loadEnv, Modules, defineConfig } from '@medusajs/utils'
import { MeilisearchPluginOptions } from '@rokmohar/medusa-plugin-meilisearch'

// Load environment variables from .env file
loadEnv(process.env.NODE_ENV || 'development', process.cwd())

/**
 * Toggle between using constants (getter functions) or direct process.env.
 * Set USE_CONSTANTS_ENV=true in your .env to use the constants getter approach.
 */
const useConstants = process.env.USE_CONSTANTS_ENV === 'true'

/**
 * Dynamically import either the constants getter functions or use process.env directly.
 */
let env: any
if (useConstants) {
  env = require('./src/lib/constants')
} else {
  env = process.env
}

/**
 * Medusa configuration.
 * All environment variables are accessed via `env`, which is either the constants getter functions or process.env.
 */
module.exports = defineConfig({
  // Admin panel configuration
  admin: {
    storefrontUrl: useConstants ? env.getBackendUrl() : env.BACKEND_URL,
    backendUrl: useConstants ? env.getStoreFrontendUrl() : env.STORE_FRONTEND_URL,
    disable: useConstants ? env.shouldDisableAdmin() : env.MEDUSA_DISABLE_ADMIN === 'true',
  },
  // Project configuration
  projectConfig: {
    databaseUrl: useConstants ? env.getDatabaseUrl() : env.DATABASE_URL,
    databaseLogging: false,
    redisUrl: useConstants ? env.getRedisUrl() : env.REDIS_URL,
    workerMode: useConstants ? env.getWorkerMode() : env.MEDUSA_WORKER_MODE || 'shared',
    http: {
      storeCors: useConstants ? env.getStoreCors() : env.STORE_CORS,
      adminCors: useConstants ? env.getAdminCors() : env.ADMIN_CORS,
      authCors: useConstants ? env.getAuthCors() : env.AUTH_CORS,
      jwtSecret: useConstants ? env.getJwtSecret() : env.JWT_SECRET,
      jwtExpiresIn: useConstants ? env.getJwtExpiresIn() : env.JWT_EXPIRES_IN,
      cookieSecret: useConstants ? env.getCookieSecret() : env.COOKIE_SECRET,
    }
  },
  // Modules configuration
  modules: [
    // Payment module (Comgate)
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
    // File storage (Minio or local)
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          ...((useConstants
            ? env.getMinioEndpoint() && env.getMinioAccessKey() && env.getMinioSecretKey()
            : env.MINIO_ENDPOINT && env.MINIO_ACCESS_KEY && env.MINIO_SECRET_KEY)
            ? [{
                resolve: './src/modules/minio-file',
                id: 'minio',
                options: {
                  endPoint: useConstants ? env.getMinioEndpoint() : env.MINIO_ENDPOINT,
                  port: useConstants ? env.getMinioPort() : (env.MINIO_PORT ? parseInt(env.MINIO_PORT, 10) : 9000),
                  accessKey: useConstants ? env.getMinioAccessKey() : env.MINIO_ACCESS_KEY,
                  secretKey: useConstants ? env.getMinioSecretKey() : env.MINIO_SECRET_KEY,
                  bucket: useConstants ? env.getMinioBucket() : env.MINIO_BUCKET,
                  useSSL: false, // for local dev
                }
              }]
            : [{
                resolve: '@medusajs/file-local',
                id: 'local',
                options: {
                  upload_dir: 'static',
                  backend_url: `${useConstants ? env.getBackendUrl() : env.BACKEND_URL}/static`
                }
              }])
        ]
      }
    },
    // Redis event bus and workflow engine
    ...((useConstants ? env.getRedisUrl() : env.REDIS_URL) ? [{
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: useConstants ? env.getRedisUrl() : env.REDIS_URL
      }
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          url: useConstants ? env.getRedisUrl() : env.REDIS_URL,
        }
      }
    }] : []),
    // Notification providers (SendGrid or Resend)
    ...(((useConstants ? env.getSendgridApiKey() && env.getSendgridFromEmail() : env.SENDGRID_API_KEY && env.SENDGRID_FROM_EMAIL) ||
        (useConstants ? env.getResendApiKey() && env.getResendFromEmail() : env.RESEND_API_KEY && env.RESEND_FROM_EMAIL)) ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(useConstants
            ? env.getSendgridApiKey() && env.getSendgridFromEmail()
            : env.SENDGRID_API_KEY && env.SENDGRID_FROM_EMAIL
          ) ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: useConstants ? env.getSendgridApiKey() : env.SENDGRID_API_KEY,
              from: useConstants ? env.getSendgridFromEmail() : env.SENDGRID_FROM_EMAIL,
            }
          }] : [],
          ...(useConstants
            ? env.getResendApiKey() && env.getResendFromEmail()
            : env.RESEND_API_KEY && env.RESEND_FROM_EMAIL
          ) ? [{
            resolve: './src/modules/resend',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: useConstants ? env.getResendApiKey() : env.RESEND_API_KEY,
              from: useConstants ? env.getResendFromEmail() : env.RESEND_FROM_EMAIL,
            },
          }] : [],
        ]
      }
    }] : []),
    // Sanity integration
    {
      resolve: "./src/modules/sanity",
      options: {
        api_token: useConstants ? env.getSanityApiToken() : env.SANITY_API_TOKEN,
        project_id: useConstants ? env.getSanityProjectId() : env.SANITY_PROJECT_ID,
        api_version: new Date().toISOString().split("T")[0],
        dataset: "production",
        studio_url: useConstants ? env.getSanityStudioUrl() : env.SANITY_STUDIO_URL,
        type_map: {
          product: "product",
        },
      },
    },
    // Wishlist module
    {
      resolve: "./src/modules/wishlist",
    },
    // Analytics (Segment)
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "./src/modules/segment",
            id: "segment",
            options: {
              writeKey: useConstants ? env.getSegmentWriteKey() : env.SEGMENT_WRITE_KEY,
            },
          },
        ],
      },
    }, 
    // Fulfillment providers
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
    // Algolia integration
    {
      resolve: "./src/modules/algolia",
      options: {
        appId: useConstants ? env.getAlgoliaAppId() : env.ALGOLIA_APP_ID,
        apiKey: useConstants ? env.getAlgoliaApiKey() : env.ALGOLIA_API_KEY,
        productIndexName: useConstants ? env.getAlgoliaProductIndexName() : env.ALGOLIA_PRODUCT_INDEX_NAME,
      }
    },
    // Product review module
    {
      resolve: "./src/modules/product-review",
    },
    // Restock module
    {
      resolve: "./src/modules/restock"
    },
    // Bundled product module
    {
      resolve: "./src/modules/bundled-product",
    },
    // Stripe payment provider
    ...((useConstants ? env.getStripeApiKey() && env.getStripeWebhookSecret() : env.STRIPE_API_KEY && env.STRIPE_WEBHOOK_SECRET) ? [{
      key: Modules.PAYMENT,
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: useConstants ? env.getStripeApiKey() : env.STRIPE_API_KEY,
              webhookSecret: useConstants ? env.getStripeWebhookSecret() : env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    }] : [])
  ],
  // Plugins configuration
  plugins: [
    // Meilisearch plugin
    ...((useConstants ? env.getMeilisearchHost() && env.getMeilisearchAdminKey() : env.MEILISEARCH_HOST && env.MEILISEARCH_ADMIN_KEY) ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: useConstants ? env.getMeilisearchHost() : env.MEILISEARCH_HOST,
          apiKey: useConstants ? env.getMeilisearchAdminKey() : env.MEILISEARCH_ADMIN_KEY,
        },
        settings: {
          // The key is used as the index name in Meilisearch
          products: {
            // Required: Index type
            type: 'products',
            // Optional: Whether the index is enabled. When disabled:
            // - Index won't be created or updated
            // - Documents won't be added or removed
            // - Index won't be included in searches
            // - All operations will be silently skipped
            enabled: true,
            // Optional: Specify which fields to include in the index
            // If not specified, all fields will be included
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
            // Create your own transformer
            /*transformer: (product) => ({
              id: product.id,
              // other attributes...
            }),*/
          },
        },
        i18n: {
          // Choose one of the following strategies:

          // 1. Separate index per language
          // strategy: 'separate-index',
          // languages: ['en', 'fr', 'de'],
          // defaultLanguage: 'en',

          // 2. Language-specific fields with suffix
          strategy: 'field-suffix',
          languages: ['en', 'fr', 'de', 'cs', 'sk', 'pl'],
          defaultLanguage: 'cs',
          translatableFields: ['title', 'description'],
        },
      } satisfies MeilisearchPluginOptions
    }] : [])
  ]
})