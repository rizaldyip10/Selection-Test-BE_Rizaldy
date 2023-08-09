const { Op } = require('sequelize');
const { User, Position } = require('../models')

module.exports = {
    getEmployee: async (req, res) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search
            const sort = req.query.sort || "ASC"
            const sortBy = req.query.sort || "firstName"
            const condition = { isDeleted: false, isSuspended: false, isAdmin: false };

            if (search) {
                condition[Op.or] = [{ firstName: { [Op.like]: `%${search}%` } }, { lastName: { [Op.like]: `%${search}%` } }];
            }

            const isAdmin = await User.findOne({
                where: {
                    id: req.user.id
                }
            })
            if (!isAdmin.isAdmin) throw { message: "Only admin have access"}

            const result = await User.findAll({
                attributes: {exclude: ['password', 'isAdmin', 'isDeleted', 'updatedAt']},
                limit,
                offset,
                order: [
                    [sortBy, sort]
                ],
                where: condition,
                include: [{ model: Position }]
            })

            const count = await User.count({ where: condition })

            res.status(200).send({
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                totalUser: count,
                result,
            })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    getPosition: async (req, res) => {
        try {
            const result = await Position.findAll()

            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    changePic: async (req, res) => {
        try {
            if (req.file == undefined) {
                throw { message: "Image should not be empty" };
            }
            const result = await User.update({
                imgProfile: req.file.filename,
            },{
                where: {
                    id: req.user.id,
                },
            }
          );
          res.status(200).send({ result, message: "Upload success" });
        } catch (error) {
          res.status(400).send(error);
          console.log(error);
        }
      },
}