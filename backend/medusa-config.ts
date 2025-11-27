
// @ts-nocheck
import { defineConfig, loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Temporary debug to verify Supabase/S3 env vars are loaded correctly.
// You can remove this once everything works.
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('[medusa-config] S3/Supabase file config:', {
    AWS_ENDPOINT: process.env.AWS_ENDPOINT,
    AWS_FILE_URL: process.env.AWS_FILE_URL,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
  })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      // @ts-expect-error: vendorCors is not a valid config
      vendorCors: process.env.VENDOR_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret'
    }
  },
  admin: {
    disable: true,
  },
  plugins: [
    {
      resolve: '@mercurjs/b2c-core',
      options: {}
    },
    {
      resolve: '@mercurjs/commission',
      options: {}
    },
    // {
    //   resolve: '@mercurjs/algolia',
    //   options: {
    //     apiKey: process.env.ALGOLIA_API_KEY,
    //     appId: process.env.ALGOLIA_APP_ID
    //   }
    // },
    {
      resolve: '@mercurjs/reviews',
      options: {}
    },
    {
      resolve: '@mercurjs/requests',
      options: {}
    },
    {
      resolve: '@mercurjs/resend',
      options: {}
    }
  ],
  modules: [
    {
      resolve: "./src/modules/category-image",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          // Use S3 if credentials are provided, otherwise fall back to local
          ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
            ? [{
                resolve: "@medusajs/medusa/file-s3",
                id: "s3",
                options: {
                  file_url: process.env.AWS_FILE_URL,
                  access_key_id: process.env.AWS_ACCESS_KEY_ID,
                  secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
                  region: process.env.AWS_REGION,
                  bucket: process.env.AWS_BUCKET,
                  endpoint: process.env.AWS_ENDPOINT,
                },
              }]
            : [{
                resolve: "@medusajs/medusa/file-local",
                id: "local",
                options: {
                  upload_dir: "uploads",
                  backend_url: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
                },
              }]),
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve:
              '@mercurjs/payment-stripe-connect/providers/stripe-connect',
            id: 'stripe-connect',
            options: {
              apiKey: process.env.STRIPE_SECRET_API_KEY
            }
          }
        ]
      }
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: '@mercurjs/resend/providers/resend',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL
            }
          },
          {
            resolve: '@medusajs/medusa/notification-local',
            id: 'local',
            options: {
              channels: ['feed', 'seller_feed']
            }
          }
        ]
      }
    }
  ]
})
