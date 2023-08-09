const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Token } = require('../models')
const fs = require('fs')
const handlebars = require('handlebars')
const transporter = require('../middlewares/transporter')

module.exports = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, password, phone, gender, birthdate } = req.body

            const isPhoneExist = await User.findOne({ where: { phone } })
            if (isPhoneExist) throw { message: "Phone number already taken" }

            const isTokenExist = await Token.findOne({
                where: {
                    token: req.token
                }
            })
            if (isTokenExist) throw { message: "Link is Expired" }
            await Token.create({ token: req.token })

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            const result = await User.create({
                firstName,
                lastName,
                email: req.user.email,
                password: hashPassword,
                phone,
                gender,
                birthdate: new Date(birthdate),
                PositionId: +req.user.posId
            })

            res.status(200).send({
                status: true,
                result,
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const result = await User.findOne({
                where: { email },
            })
            if (!result) throw { message: "Account not found" }
            // if (password !== result.password) throw { message: "Incorrect Password" }
            const isValid = await bcrypt.compare(password, result.password)
            if (!isValid) throw { message: "Incorrect password" }

            let payload = { id: result.id }
            const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '3d' })

            res.status(200).send({
                message: "Login Success, welcome!",
                result,
                token
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    addUser: async (req, res) => {
        try {
            const { email, posId } = req.body

            const isAdmin = await User.findOne({
                where: {
                    id: req.user.id
                }
            })
            if (!isAdmin.isAdmin) throw { message: "Only admin can add employee" }

            const isEmailExist = await User.findOne({ where: { email } })
            if (isEmailExist) throw { message: "Email already exist"}

            const payload = { email, posId }
            const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "1d"} )

            const message = "Dear new recruit,"
            const data = fs.readFileSync('./helpers/register.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({ token, message })

            await transporter.sendMail({
                from: process.env.TRANSPORTER_EMAIL,
                to: email,
                subject: 'Registration Form',
                html: tempResult
            })

            res.status(200).send({
                message: "Email have been sent",
                token
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    keepLogin: async (req, res) => {
        try {
            const result = await User.findOne({
                where: {
                    id: req.user.id
                },
                attributes: { exclude: ['password', 'phone', 'isSuspended', 'isDeleted', 'updatedAt'] }
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    deleteUser: async (req, res) => {
        try {
            
        } catch (error) {
            res.status(400)
        }
    }
}