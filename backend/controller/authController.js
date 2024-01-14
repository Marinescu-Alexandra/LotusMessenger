const formidable = require('formidable');
const validator = require('validator')
const registerModel = require('../models/authModel')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var Cookies = require('cookies')

module.exports.userRegister = async (req, res) => {
    console.log(req.body)
    const { username, email, password } = req.body;

    const error = [];

    if (!username) {
        error.push('Please provide an user name.')
    }
    if (!email) {
        error.push('Please provide an email.')
    }
    if (!password) {
        error.push('Please provide a password.')
    }

    if (email && !validator.isEmail(email)) {
        error.push('Plese provide a valid email.')
    }
    if (error.length > 0) {
        res.status(400).json({
            error: {
                errorMessage: error
            }
        })
    } else {
        try {
            const checkUser = await registerModel.findOne({
                email: email,
            })
            if (checkUser) {
                res.status(404).json({
                    error: {
                        errorMessage: ['The provided email is already in use.']
                    }
                })
            } else {
                console.log("Email is valid and not on use.")
                try {
                    const userCreate = await registerModel.create({
                        username,
                        email,
                        password: await bycrypt.hash(password, 10)
                    });

                    const token = jwt.sign({
                        id: userCreate._id,
                        email: userCreate.email,
                        username: userCreate.username,
                        registerTimer: userCreate.createdAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    })

                    const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }
                    try {
                        res.status(201).cookie('authToken', token, options).json({
                            successMessage: 'Registration complete.', token
                        })
                    } catch (error) {
                        console.log(error)
                        res.status(500).json({
                            error: {
                                errorMessage: error
                            }
                        })
                    }
                    console.log('Registration complete')

                } catch (error) {
                    res.status(500).json({
                        error: {
                            errorMessage: error
                        }
                    })
                }

            }
        } catch (error) {
            res.status(500).json({
                error: {
                    errorMessage: error
                }
            })
        }
    }

    console.log('Register is working')
}

module.exports.userLogin = async (req, res) => {
    const error = [];
    const { email, password } = req.body;
    if (!email) {
        error.push('Please provide an email.')
    }
    if (!email) {
        error.push('Please provide a password.')
    }
    if (email && !validator.isEmail(email)) {
        error.push('Please provide a valid email.')
    }
    if (error.length > 0) {
        res.status(400).json({
            error: {
                errorMessage: error
            }
        })
    } else {
        try {
            const checkUser = await registerModel.findOne({
                email: email
            }).select('+password');
            if (checkUser) {
                const matchPassword = await bycrypt.compare(password, checkUser.password);
                if (matchPassword) {
                    const token = jwt.sign({
                        id: checkUser._id,
                        email: checkUser.email,
                        username: checkUser.username,
                        registerTimer: checkUser.createdAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    })
           
                    const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }

                    try {
                        res.status(200).cookie('authToken', token, options).json({
                            successMessage: 'Login successful', token
                        })
                    } catch (error) {
                        console.log(error)
                        res.status(500).json({
                            error: {
                                errorMessage: error
                            }
                        })
                    }
                    console.log('Login successful')
                } else {
                    res.status(500).json({
                        error: {
                            errorMessage: ['Password not valid.']
                        }
                    })
                }
            } else {
                res.status(500).json({
                    error: {
                        errorMessage: ['Email not valid. Please use another email or register.']
                    }
                })
            }
        } catch (error) {
            res.status(404).json({
                error: {
                    errorMessage: ['Internal server error', error]
                }
            })
        }
    }
}

module.exports.userLogout = (req, res) => {
    res.status(201).cookie('authToken', '').json({
        success: true
    })
}