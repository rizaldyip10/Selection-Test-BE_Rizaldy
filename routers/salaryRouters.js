const { salaryControllers } = require("../controllers")
const { verifyToken } = require("../middlewares/auth")
const router = require("express").Router()

router.get("/", verifyToken, salaryControllers.employeeSalary)
router.get("/overtime", verifyToken, salaryControllers.overtimeSalary)
router.get("/yearly", verifyToken, salaryControllers.yearlySalary)

module.exports = router