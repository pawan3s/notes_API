import express, { Application } from 'express'
const app: Application = express()
app.use(express.json())

import userRoutes from './Routes/userRoutes'
import NoteRoutes from './Routes/noteRoutes'

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/notes', NoteRoutes)

export default app
