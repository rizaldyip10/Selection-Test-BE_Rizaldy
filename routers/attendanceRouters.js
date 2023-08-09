const { attendanceControllers } = require("../controllers")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()

router.post("/clockin", verifyToken, attendanceControllers.clockIn)
router.post("/clockout", verifyToken, attendanceControllers.clockOut)
router.get("/todaylog", verifyToken, attendanceControllers.todayLog)
router.get("/loghistory", verifyToken, attendanceControllers.logHistory)

module.exports = router