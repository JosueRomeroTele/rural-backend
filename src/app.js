import express from 'express';
import bodyParser from 'body-parser'
import userRoute from './routes/user.routes.js'
import deviceRoute from './routes/device.routes.js'
const app = express()

 app.use(express.json())

 app.use(bodyParser.json())


 app.use('/api/user',userRoute)
 app.use('/api/device',deviceRoute)

export default app;