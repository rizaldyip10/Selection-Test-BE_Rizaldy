const { Op } = require("sequelize")
const { User, Position, Attendance } = require("../models")

module.exports = {
    employeeSalary: async (req, res) => {
        try {
            const { id } = req.user
            const checkUser = await User.findOne({
                where: { id },
                include: [{ model: Position }]
            })
            if (!checkUser) throw { message: "Account not found" }

            const result = await Attendance.findAll({
                where: { UserId: id },
                include: [{
                    model: User,
                    attributes: {exclude: ['isAdmin', 'isDeleted', 'isSuspended', 'password', 'createdAt', 'updatedAt']},
                    include: [{ model: Position }]
                }]
            })
            
            const baseSalary = checkUser.Position.salary;
            const hourSalary = baseSalary / 8;

            const updatedResult = result.map(log => {
                let deduction = 0;
                if (log.clockIn && !log.clockOut) {
                    deduction = log.User.Position.salary * 0.5;
                } else if (!log.clockIn && !log.clockOut) {
                    deduction = log.User.Position.salary;
                }

                let salaryOT = 0;
                if (log.clockInOT && log.clockOutOT) {
                    const delta = (log.clockOutOT - log.clockInOT) / (60 * 60 * 1000);

                    for (let i = 1; i <= delta; i++) {
                        if (i > 1) salaryOT += 2 * hourSalary;
                        else salaryOT += 1.5 * hourSalary;
                    }
                }

                return {
                    ...log.toJSON(),
                    deduction,
                    salaryOT,
                };
            })

            res.status(200).send({
                result: updatedResult
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    overtimeSalary: async (req, res) => {
        try {
            const { id } = req.user
            const checkUser = await User.findOne({
                where: { id },
                include: [{ model: Position }]
            })
            if (!checkUser) throw { message: "Account not found" }

            const attendanceLog = await Attendance.findAll({
                where: {
                    UserId: id,
                    clockInOT: { [Op.ne]: null },
                    clockOutOT: { [Op.ne]: null },
                }
            })

            const baseSalary = checkUser.Position.salary
            const hourSalary = baseSalary / 8
            
            let salaryOT = 0
            for (const log of attendanceLog) {
                if (log.clockInOT && log.clockOutOT) {
                    const delta = (log.clockOutOT - log.clockInOT) / (60 * 60 * 1000)
                    console.log(delta);

                    for (let i = 1; i <= delta; i++) {
                        if (i > 1) salaryOT += 2 * hourSalary
                        
                        if (i = 1) salaryOT += 1.5 * hourSalary
                    }
                }
            }

            res.status(200).send({salaryOT})
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    yearlySalary: async (req, res) => {
        try {
            const { id } = req.user;
            const checkUser = await User.findOne({
                where: { id },
                include: [{ model: Position }],
            });
            if (!checkUser) throw { message: "Account not found" };
    
            const attendanceLog = await Attendance.findAll({
                where: {
                    UserId: id,
                    clockInOT: { [Op.ne]: null },
                    clockOutOT: { [Op.ne]: null },
                },
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ['isAdmin', 'isDeleted', 'isSuspended', 'password', 'createdAt', 'updatedAt'],
                        },
                        include: [{ model: Position }],
                    },
                ],
            });
    
            const baseSalary = checkUser.Position.salary;
            const hourSalary = baseSalary / 8;
    
            const monthlyRecap = Array.from({ length: 12 }, () => ({
                totalSalary: 0,
                totalDeduction: 0,
                totalSalaryOT: 0,
            }));
    
            attendanceLog.forEach(log => {
                const year = new Date(log.clockInOT).getFullYear();
                const month = new Date(log.clockInOT).getMonth();
    
                let deduction = 0;
                let salaryOT = 0;
    
                if (log.clockIn && !log.clockOut) {
                    deduction = log.User.Position.salary * 0.5;
                } else if (!log.clockIn && !log.clockOut) {
                    deduction = log.User.Position.salary;
                }
    
                if (log.clockInOT && log.clockOutOT) {
                    const delta = (log.clockOutOT - log.clockInOT) / (60 * 60 * 1000);
    
                    for (let i = 1; i <= delta; i++) {
                        if (i > 1) salaryOT += 2 * hourSalary;
                        else salaryOT += 1.5 * hourSalary;
                    }
                }
    
                monthlyRecap[month].totalSalary += baseSalary - deduction;
                monthlyRecap[month].totalDeduction += deduction;
                monthlyRecap[month].totalSalaryOT += salaryOT;
            });
    
            res.status(200).send({
                monthlyRecap,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },    
}