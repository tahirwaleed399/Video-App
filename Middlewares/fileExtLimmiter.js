const path = require("path")
const { jsonResponce } = require("../Utils/responce")

const fileExtLimmiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files

        const fileExtensions = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        // Are the file extension allowed? 
        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

            return jsonResponce(res , 422 , false , { status: "error", message }) ;
        }

        next()
    }
}

module.exports = fileExtLimmiter