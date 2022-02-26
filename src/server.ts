import dotenv from 'dotenv'
import app from './app'
import mongoose from 'mongoose'
dotenv.config()

const connect = async (): Promise<void> => {
  const dBURI: any = process.env.DATABASE_URI
  try {
    await mongoose.connect(dBURI)
    console.log('DataBase Connected')
  } catch (error) {
    console.log('could not connect to db')
    process.exit(1)
  }
}

connect()
const PORT: any = process.env.PORT
app.listen(PORT, () => console.log(`connected to port ${PORT}`))
