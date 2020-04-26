export const IsProd = process.env.NODE_ENV === 'production'
export const Port = process.env.PORT || 3000
export const MongoUri = process.env.MONGO_URI || ''
export const JwtSecret = () => process.env.JWT_SECRET || ''
