import express from 'express';
import bodyParser from 'body-parser'
import userRoute from './routes/user.routes.js'
import deviceRoute from './routes/device.routes.js'
import deviceItemRoute from './routes/device.item.routes.js'
import authRoute from './routes/authentication.routes.js'

import cors from 'cors';

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())


app.use('/api/user', userRoute)
app.use('/api/device', deviceRoute)
app.use('/api/items', deviceItemRoute)
app.use('/api/auth', authRoute)

export default app;