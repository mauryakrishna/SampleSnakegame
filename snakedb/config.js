module.exports = {
    'modelschema':{
        displayname: {
            type: String,
            required: true
        },
        emailid: {
            type: String,
            required: true
        },
        emailidvalidated: {
            type: Boolean,
            default: false
        },
        emailvalidationcode:{
            type: String
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 200
        },
        tokens:[String],
        scores: [{date: { type: Date, default: Date.now() }, score: Number}]
    },
    'emailSchema': {
        'emailid': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Please provide valid email id.'
            }/*,
            matches: {
                options: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi]
            }*/
        }
    },

    'passwordSchema':{
        'password': {
            notEmpty: true,
            errorMessage: 'Invalid password.'
        },
        'newpassword': {
            optional: true,
            errorMessage: 'Invalid new password.'
        }
    },

    'nameSchema': {
        'displayname': {
            notEmpty: true,
            isLength: {
                options: [{ min: 2, max: 200 }],
                errorMessage: 'Must be between 2 and 200 chars long.' // Error message for the validator, takes precedent over parameter message
            }/*,
            matches: {
                options: [/^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/gi]
            }*/
        }
    },
    'numberSchema': {
        'number': {
            notEmpty: true,
            isInt: {
                errorMessage: 'Must be number.'
            }
        }
    },
    'cryptoalgorithm':'aes-256-ctr', //cryptographic algorithm you choose for encryption
    'successcode':200,
    'sessionexpired': 401,
    'internalservererror':500,
    'modelname':'snakedb',
    'secret': 'AnySecreteRandomKeyYouChoose',
    'database': 'mongodb://localhost/snakedb', //db name on MongoDB
    'mongodbuser': 'webuser' //admin user name

};