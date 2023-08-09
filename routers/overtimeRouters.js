const { overtimeControllers } = require("../controllers")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()

router.post("/", verifyToken, overtimeControllers.clockInOT)
router.patch("/", verifyToken, overtimeControllers.clockOutOT)

module.exports = router