const { body, validationResult, oneOf } = require('express-validator')
const fs = require('fs')

module.exports = {
    checkRegister: async (req, res, next) => {
        try {
            await body('firstName')
                .notEmpty().withMessage("First name cannot be empty")
                .run(req)
            await body('lastName')
                .notEmpty().withMessage("Last name cannot be empty")
                .run(req)
            await body('password')
                .notEmpty().withMessage("Password cannot be empty")
                .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols:1 }).withMessage("Password is not strong enough")
                .run(req)
            await body("confirmPassword")
                .notEmpty().withMessage("Please confirm your password")
                .equals(req.body.password).withMessage("Password did not match")
                .run(req)
            await body('phone')
                .notEmpty().withMessage("Phone number cannot be empty")
                .isMobilePhone().withMessage("Invalid phone number")
                .run(req)
            await body('gender')
                .notEmpty().withMessage("Please fill your gender")
            await body("birthdate")
                .notEmpty().withMessage("Please enter your birthdate")
                .isDate().withMessage("Birthdate must be a date")

            const validation = validationResult(req)

            if (validation.isEmpty()) {
                next()
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Validation invalid",
                    error: validation.array()
                })
            }
        } catch (err) {
            res.status(400).send(err)
        }
    },
    checkLogin: async (req, res, next) => {
        try {
            await body('email')
                .notEmpty().withMessage("Email cannot be empty")
                .isEmail().withMessage("Invalid email")
                .run(req)
            await body('password')
                .notEmpty().withMessage("Password cannot be empty")
                .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols:1 }).withMessage("Password is not strong enough")
                .run(req)
            
            const validation = validationResult(req)

            if (validation.isEmpty()) {
                next()
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Validation invalid",
                    error: validation.array()
                })
            }
        } catch (error) {
            res.status(400).send(error)
        }
    },
    checkAddUser: async (req, res, next) => {
        try {
            await body('email')
                .notEmpty().withMessage("Email cannot be empty")
                .isEmail().withMessage("Invalid email")
                .run(req)
            
            const validation = validationResult(req)

            if (validation.isEmpty()) {
                next()
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Validation invalid",
                    error: validation.array()
                })
            }
        } catch (error) {
            res.status(400).send(error)
        }
    }
}