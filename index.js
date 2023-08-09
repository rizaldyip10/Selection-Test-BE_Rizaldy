const express = require('express')
const db = require('./models')
const { authRouters, employeeRouters, attendanceRouters, salaryRouters, overtimeRouters } = require('./routers')
require('dotenv').config()
const cors = require("cors")

const PORT = 9000
const app = express()

app.use(express.json())
app.use(express.static('./public'))
app.use(cors())

app.get("/", (req, res) => {
    res.status(200).send("Success")
})

app.use("/api/auth", authRouters)
app.use("/api/user", employeeRouters)
app.use("/api/attendance", attendanceRouters)
app.use("/api/salary", salaryRouters)
app.use("/api/overtime", overtimeRouters)

app.listen(PORT, () => {
    // db.sequelize.sync({ alter: true })
    console.log(`This server is running on port ${PORT}`);
})