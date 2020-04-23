import * as path from 'path'

import * as cors from 'cors'
import * as express from 'express'
import * as logger from 'morgan'
import * as swaggerUi from 'swagger-ui-express'

import api from './api'
import { specs } from './docs-config'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', express.static(path.join(__dirname, '../public'), { redirect: false }))

app.use(api)

export default app
