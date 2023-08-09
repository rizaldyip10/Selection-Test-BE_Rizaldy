const { Op } = require('sequelize');
const { User, Attendance } = require('../models')

module.exports = {
    clockIn: async (req, res) => {
        try {
            const note = req.body.note
            const checkUser = await User.findOne({
                where: {
                    id: req.user.id
                }
            })
            if (!checkUser) throw { message: "No account found" }

            const todayStart = new Date()
            todayStart.setDate(todayStart.getDate() + 1)
            todayStart.setHours(-17,0,0,0)

            const todayEnd = new Date()
            todayEnd.setDate(todayEnd.getDate() + 1)
            todayEnd.setHours(6,59,59,599)

            const checkClockIn = await Attendance.findOne({
                where: {
                    UserId: req.user.id,
                    clockIn: {
                        [Op.and]: {
                            [Op.gte]: todayStart,
                            [Op.lte]: todayEnd
                        }
                    }
                }
            })

            if (checkClockIn) throw { message: "You have clocked in" }

            const date = new Date()
            const timeNow = new Date(date.getTime() + (7 * 3600 * 1000))

            await Attendance.create({
                UserId: req.user.id,
                clockIn: timeNow,
                note
            })

            res.status(200).send({
                message: "Clock In Success!",
            })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    clockOut: async (req, res) => {
        try {
            const checkUser = await User.findOne({
                where: {
                    id: req.user.id
                }
            })
            if (!checkUser) throw { message: "No account found" }

            const todayStart = new Date()
            todayStart.setDate(todayStart.getDate() + 1)
            todayStart.setHours(-17,0,0,0)

            const todayEnd = new Date()
            todayEnd.setDate(todayEnd.getDate() + 1)
            todayEnd.setHours(6,59,59,599)

            const checkClockOut = await Attendance.findOne({
                where: {
                    UserId: req.user.id,
                    clockOut: {
                        [Op.and]: {
                            [Op.gte]: todayStart,
                            [Op.lte]: todayEnd
                        }
                    }
                }
            })

            if (checkClockOut) throw { message: "You have clocked out" }

            const date = new Date()
            const timeNow = new Date(date.getTime() + (7 * 3600 * 1000))

            await Attendance.update({ clockOut: timeNow }, {
                where: {
                    UserId: req.user.id,
                    clockIn: {
                        [Op.and]: {
                            [Op.gte]: todayStart,
                            [Op.lte]: todayEnd
                        }
                    }
                }
            })

            res.status(200).send({
                message: "Clock Out Success!",
            })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    todayLog: async (req, res) => {
        try {
            const checkUser = await User.findOne({
                where: {
                    id: req.user.id
                }
            })

            if (!checkUser) throw { message: "Account not found" }

            const todayStart = new Date()
            todayStart.setDate(todayStart.getDate() + 1)
            todayStart.setHours(-17,0,0,0)

            const todayEnd = new Date()
            todayEnd.setDate(todayEnd.getDate() + 1)
            todayEnd.setHours(6,59,59,599)

            const result = await Attendance.findOne({
                where: {
                    UserId: req.user.id,
                    [Op.or]: [
                        {clockOut: {
                            [Op.and]: {
                                [Op.gte]: todayStart,
                                [Op.lte]: todayEnd
                            }
                        }},
                        {clockIn: {
                            [Op.and]: {
                                [Op.gte]: todayStart,
                                [Op.lte]: todayEnd
                            }
                        }},
                    ]
                }
            })

            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    logHistory: async (req, res) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const offset = (page - 1) * limit;
            const sort = req.query.sort || "ASC"
            const sortBy = req.query.sort || "clockIn"

            const checkUser = await User.findOne({
                where: {
                    id: req.user.id
                }
            })
            if (!checkUser) throw { message: "Account not found" }

            const result = await Attendance.findAll({
                where: {
                    UserId: req.user.id
                },
                limit,
                offset,
                order: [
                    [sortBy, sort]
                ]
            })

            const count = await Attendance.count({
                where: {
                    UserId: req.user.id
                }
            })

            res.status(200).send({
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                totalLog: count,
                result,
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
}