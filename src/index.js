const express = require('express')
const router = require('./controllers/routes')

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000;

app.use('/api', router)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))