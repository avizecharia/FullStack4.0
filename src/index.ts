import exp,{Express} from 'express'
import beeperController from './controllers/beeperController'
import 'dotenv/config'

const app :Express =exp()

app.use(exp.json())

app.use('/api',beeperController)

app.listen(process.env.PORT,() :void => console.log(`see you at hhtp::localhost:${process.env.PORT}`)
)