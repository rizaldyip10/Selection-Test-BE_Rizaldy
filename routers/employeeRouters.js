const router = require("express").Router()
const employeeControllers = require("../controllers/employeeControllers");
const { verifyToken } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");


router.get("/", verifyToken, employeeControllers.getEmployee)
router.get("/position", employeeControllers.getPosition)
router.patch("/picture", verifyToken, multerUpload().single("file"), employeeControllers.changePic)

module.exports = router