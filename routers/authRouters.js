const { authControllers } = require("../controllers")
const { verifyToken } = require("../middlewares/auth")
const { checkRegister, checkLogin, checkAddUser } = require("../middlewares/validator")
const router = require("express").Router()

router.post("/", checkRegister, verifyToken, authControllers.register)
router.get("/", verifyToken, authControllers.keepLogin)
router.post("/login", checkLogin, authControllers.login)
router.post("/user", verifyToken, checkAddUser, authControllers.addUser)

module.exports = router