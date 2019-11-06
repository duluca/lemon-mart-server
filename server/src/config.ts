export let isProd = process.env.NODE_ENV === 'production'
export let port = process.env.PORT || 3000
export let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/lemon-mart'
