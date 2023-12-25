import * as document from 'document-ts'
import * as http from 'http'
import app from './app'
import * as config from './config'
import { useGraphQL } from './graphql/api.graphql'
import { UserCollection } from './models/user'
import { initializeDemoUser } from './services/userService'

export let server: http.Server

async function start() {
  console.log('Starting server: ')
  console.log(`isProd: ${config.IsProd}`)
  console.log(`port: ${config.Port}`)
  console.log(`mongoUri: ${config.MongoUri}`)

  if (!config.JwtSecret() || config.JwtSecret() === 'xxxxxx') {
    throw new Error(
      'JWT_SECRET env var not set or set to default value. Pick a secure password.'
    )
  }

  try {
    await document.connect(config.MongoUri, config.IsProd)
    console.log('Connected to database!')
  } catch (ex) {
    console.log(`Couldn't connect to a database: ${ex}`)
  }

  server = http.createServer(app)

  await useGraphQL(app)

  server.listen(config.Port, async () => {
    console.log(`Server listening on port ${config.Port}...`)
    console.log('Initializing default user...')
    await createIndexes()
    // Seed the database with a demo user. Replace with your own function to seed admin users
    await initializeDemoUser(
      process.env.DEMO_EMAIL || '',
      process.env.DEMO_PASSWORD || '',
      process.env.DEMO_USERID || ''
    )
    console.log('Done.')
  })
}

async function createIndexes() {
  await UserCollection.createIndexes()
  console.log('Create indexes...')
  await UserCollection.createIndexes()
}

start()
