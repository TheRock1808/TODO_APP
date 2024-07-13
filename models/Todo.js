const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/todoapp",{
}).then(() =>{
    console.log("CONNECTED TO DATABASE");
}).catch((e) =>{
    console.log("CONNECTION FAILED");
})

const TodoSchema = new mongoose.Schema(
    {
        task: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("todos", TodoSchema);