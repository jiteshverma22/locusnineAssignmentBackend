const Schema = require('validate');

class User {
    constructor({name, email, role, mobile}) {
        this.name = name,
        this.email = email,
        this.role = role

        if(mobile) this.mobile = mobile;
    }
    validate(){
        const userSchema = new Schema({
            name: {
                type: String,
                required: true,
                length: {min: 3, max: 32}
            },
            email: {
                type: String,
                match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                required: true,
                message: `Invalid Email.`
            },
            role: {
                type: String,
                enum: ['Admin', 'Customer Executive'],
                required: true
            },
            mobile: {
                type: String,
                match: /^\d{10}$/,
                required: false,
                message: `Mobile number should contain only 10 digits.`
            }
        });
        const validationErrors = userSchema.validate(this);
        let errorMessages = '';
        if (validationErrors.length) {
            validationErrors.forEach(err => {
                errorMessages += err.message + '\n';
            });
        }
        return errorMessages;
    }
}
module.exports = User;