const { jsonResponce } = require("../Utils/responce")

const filesPayloadExists = (req, res, next) => {
    if (!req.files) return jsonResponce(res , 400 , false ,{ status: "error", message: "Missing files" }) 

    next()
}

module.exports = filesPayloadExists