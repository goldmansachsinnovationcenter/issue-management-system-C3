import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import issueRoutes from './routes/issueRoutes'
import { IssueService } from './services/IssueService'

const app = express()
const PORT = process.env.PORT || 8080

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const issueService = IssueService.getInstance()
issueService.initSampleData()

app.use('/api', issueRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Health check available at http://localhost:${PORT}/health`)
  console.log(`API endpoints available at http://localhost:${PORT}/api`)
})
