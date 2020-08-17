const bcrypt = require('bcrypt'); //used to crypt the password
const jsonWebToken = require('jsonwebtoken'); //used to create unique tokens
const emailValidator = require('email-validator'); //email validation plugin
const passwordValidator = require('password-validator'); //password validation plugin

const User = require('../models/User');

let passwordValidity = new passwordValidator(); //we declare our password validation

passwordValidity //and the we create our validation schema
.is().min(8) // minimum 8 characters
.is().max(16) // maximum 16 characters
.has().uppercase() // must have 1 uppercase
.has().lowercase() // must have 1 lowercase
.has().digits(1) // must have 1 number
.has().symbols(1) // must have 1 symbol
.has().not().spaces() // the password can't have any spaces

exports.signup = (req, res, next) => { //create an account
    if (!emailValidator.validate(req.body.email) || !passwordValidity.validate(req.body.password)) { //check email and password validity
        res.status(400).json({ message: 'Your email or password is invalid, please retry'}); //show an error message if invalid
    } else if (emailValidator.validate(req.body.email) && passwordValidity.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10) //if both are valid, we hash and salt the password to secure it
        .then(hash => {
            const user = new User({ //we create an object with the user informations
                email: req.body.email,
                password: hash
            });
            user.save() //and then we save them into the database
            .then(() => res.status(201).json({ message: 'User created !'}))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
};

exports.login = (req, res, next) => { //function to login
    User.findOne({ email: req.body.email }) //
        .then(user => {
            if(!user) {
                return res.status(404).json({ error: 'User not found !'}); //if the email isn't found into the database return an error message
            }
            bcrypt.compare(req.body.password, user.password) //if the email is found, compare the password in the input and the password into the database
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Wrong password !'}); //if the password is different, return an error message
                    }
                    res.status(200).json({ //if the passwords matches, the user is logged in
                        userId: user._id,
                        token: jsonWebToken.sign( //we generate a 24h token
                            { userId: user._id },
                            'RANDOM_SECRET_KEY',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};