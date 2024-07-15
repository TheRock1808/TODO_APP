const mongoose=require("mongoose")


const logInSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        validate: {
            validator: function(value) {
                // Regular expression to validate email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format' // Error message if validation fails
        }
    },
    password:{
        type:String,
        required:true
    }
})

const collection = mongoose.model('userlogins', logInSchema);

module.exports = collection;