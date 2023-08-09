const { Op } = require('sequelize');
const { User, Attendance } = require('../models')

module.exports = {
    clockInOT: async (req, res) => {
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

            const checkClockInOT = await Attendance.findOne({
                where: {
                    UserId: req.user.id,
                    clockInOT: {
                        [Op.and]: {
                            [Op.gte]: todayStart,
                            [Op.lte]: todayEnd
                        }
                    }
                }
            })

            if (checkClockInOT) throw { message: "You have clocked in for overtime" }

            const date = new Date()
            const timeNow = new Date(date.getTime() + (7 * 3600 * 1000))

            await Attendance.update({ clockInOT: timeNow }, {
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
                message: "OT Clock In Success!",
            })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    clockOutOT: async (req, res) => {
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

            const checkClockOutOT = await Attendance.findOne({
                where: {
                    UserId: req.user.id,
                    clockOutOT: {
                        [Op.and]: {
                            [Op.gte]: todayStart,
                            [Op.lte]: todayEnd
                        }
                    }
                }
            })

            if (checkClockOutOT) throw { message: "You have clocked out for overtime" }

            const date = new Date()
            const timeNow = new Date(date.getTime() + (7 * 3600 * 1000))

            await Attendance.update({ clockOutOT: timeNow }, {
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
                message: "OT Clock Out Success!",
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
}