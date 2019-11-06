import * as http from 'http'

import * as document from 'document-ts'

import app from './app'
import * as config from './config'
import { UserCollection } from './models/user'
import { initializeDefaultUser } from './services/userService'

export let Instance: http.Server

async function start() {
  console.log('Starting server: ')
  console.log(`isProd: ${config.isProd}`)
  console.log(`port: ${config.port}`)
  console.log(`mongoUri: ${config.mongoUri}`)

  try {
    await document.connect(config.mongoUri, config.isProd)
    console.log('Connected to database!')
  } catch (ex) {
    console.log(`Couldn't connect to a database: ${ex}`)
  }

  Instance = http.createServer(app)

  Instance.listen(config.port, async () => {
    console.log(`Server listening on port ${config.port}...`)
    console.log('Initializing default user...')
    await createIndexes()
    await initializeDefaultUser()
    console.log('Done.')
  })
}

async function createIndexes() {
  console.log('Create indexes...')
  await UserCollection.createIndexes()
}

start()
