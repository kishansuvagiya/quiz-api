var queData = require('../models/quiz');
// ------------- Quiz api----------------------
exports.AddQuestion = async function (req, res, next) {
    try {
        let data = req.body
        if (!data.question || !data.options || !data.answer || !data.category) {
            throw new Error("Please enter valid fields")
        }
        const newData = await queData.create(data)
        res.status(201).json({
            status: "success",
            messeage: "Question add successfully",
            data: newData
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.AllQuestion = async function (req, res, next) {
    try {
        let data = await queData.find().populate('category')
        res.status(200).json({
            status: "success",
            messeage: "All your data",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.DeleteQuestion = async function (req, res, next) {
    try {
        let data = await queData.findByIdAndDelete(req.query.id)
        res.status(200).json({
            status: "success",
            messeage: "Your data deleted",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.UpdateQuestion = async function (req, res, next) {
    try {
        let data = await queData.findByIdAndUpdate(req.query.id, req.body, { new: true })
        res.status(200).json({
            status: "success",
            messeage: "Your data updated",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}