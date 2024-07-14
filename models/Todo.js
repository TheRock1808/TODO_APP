const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/todoapp",{
}).then(() =>{
    console.log("CONNECTED TO DATABASE");
}).catch((e) =>{
    console.log("CONNECTION FAILED");
})

const TodoSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        task: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30,
        },
        complete: {
            type: Boolean,
            default: false,
        }
    },
);

module.exports = mongoose.model("todos", TodoSchema);