const registerModel = require('../models/authModel')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const validator = require('validator');
const { BadRequestError } = require('../errors/errors');

async function signToken({ id, email, username, createdAt, profileImage, status, theme }) {
    const token = jwt.sign({
        id: id,
        email: email,
        username: username,
        registerTimer: createdAt,
        profileImage: profileImage,
        status: status,
        theme: theme
    }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXP
    })
    const options = { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }

    return [token, options]
}

function checkForLoginErrors({ email, password }) {
    const errors = []
    if (!email) {
        errors.push('Please provide an email.')
    }
    if (!password) {
        errors.push('Please provide a password.')
    }
    if (email && !validator.isEmail(email)) {
        errors.push('Please provide a valid email.')
    }
    return errors
}

function checkForRegisterErrors({ username, email, password }) {
    const errors = []
    if (!username) {
        errors.push('Please provide an user name.')
    }
    if (!email) {
        errors.push('Please provide an email.')
    }
    if (!password) {
        errors.push('Please provide a password.')
    }

    if (email && !validator.isEmail(email)) {
        errors.push('Plese provide a valid email.')
    }

    return errors
}

module.exports.userRegister = async (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = checkForRegisterErrors({ username, email, password })
    try {
        if (errors.length > 0) {
            throw new BadRequestError(errors);
        } else {
            const checkUser = await registerModel.findOne({
                email: email,
            })
            if (checkUser) {
                throw new BadRequestError('The provided email is already in use.');
            } else {

                const userCreate = await registerModel.create({
                    username,
                    email,
                    password: await bycrypt.hash(password, 10),
                });

                const [token, options] = await signToken(
                    {
                        id: userCreate._id,
                        email: userCreate.email,
                        username: userCreate.username,
                        createdAt: userCreate.createdAt,
                        profileImage: userCreate.profileImage,
                        status: userCreate.status,
                        theme: userCreate.theme
                    }
                )
                res.status(200).cookie('authToken', token, options).json({
                    successMessage: 'Registration complete.', token
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports.userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = checkForLoginErrors({ email, password })
    try {
        if (errors.length > 0) {
            throw new BadRequestError(errors);
        } else {
            const checkUser = await registerModel.findOne({
                email: email
            }).select('+password');

            if (checkUser) {
                const matchPassword = await bycrypt.compare(password, checkUser.password);
                if (matchPassword) {
                    const [token, options] = await signToken(
                        {
                            id: checkUser._id,
                            email: checkUser.email,
                            username: checkUser.username,
                            createdAt: checkUser.createdAt,
                            profileImage: checkUser.profileImage,
                            status: checkUser.status,
                            theme: checkUser.theme
                        }
                    )
                    res.status(200).cookie('authToken', token, options).json({
                        successMessage: 'Login successful', token
                    })
                } else {
                    throw new BadRequestError('Password not valid.');
                }
            } else {
                throw new BadRequestError('Email not valid. Please use another email or register.');
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports.userLogout = (req, res) => {
    res.status(201).cookie('authToken', '').json({
        success: true
    })
}

module.exports.updateUserProfileImage = async (req, res, next) => {
    const currentUserId = req.myId;
    const form = new formidable.IncomingForm();
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                throw new err;
            }
            const profileImageName = fields['profileImageName']

            const newPath = path.join(__dirname + `../../../frontend/public/userProfileImages/${profileImageName}`)
            files['profileImage'][0].originalFilename = profileImageName
            fs.copyFile(files['profileImage'][0].filepath, newPath, (err) => {
                if (err) {
                    throw new BadRequestError('Profile image upload fail.');
                }
            })
            await registerModel.findByIdAndUpdate(currentUserId, {
                profileImage: String(profileImageName)
            })
                .then(async (user) => {
                    const [token, options] = await signToken(
                        {
                            id: user._id,
                            email: user.email,
                            username: user.username,
                            createdAt: user.createdAt,
                            profileImage: String(profileImageName),
                            status: user.status,
                            theme: user.theme
                        }
                    )
                    res.status(200).cookie('authToken', token, options).json({
                        successMessage: 'Cookie update successful',
                        profileImagePath: profileImageName,
                        token: token
                    })
                })
        });
    } catch (error) {
        next(error)
    }
}

module.exports.updateUserTheme = async (req, res, next) => {
    const currentUserId = req.myId;
    const { theme } = req.body

    try {
        await registerModel.findByIdAndUpdate(currentUserId, {
            theme: String(theme)
        })
            .then(async (user) => {
                const [token, options] = await signToken(
                    {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        createdAt: user.createdAt,
                        profileImage: user.profileImage,
                        status: user.status,
                        theme: String(theme)
                    }
                )
                res.status(200).cookie('authToken', token, options).json({
                    successMessage: 'Cookie update successful',
                    theme: theme,
                    token: token
                })
            })
    } catch (error) {
        next(error)
    }
}

module.exports.updateUserName = async (req, res, next) => {
    const currentUserId = req.myId;
    const { name } = req.body

    try {
        await registerModel.findByIdAndUpdate(currentUserId, {
            username: String(name)
        })
            .then(async (user) => {
                const [token, options] = await signToken(
                    {
                        id: user._id,
                        email: user.email,
                        username: String(name),
                        createdAt: user.createdAt,
                        profileImage: user.profileImage,
                        status: user.status,
                        theme: user.theme
                    }
                )
                res.status(200).cookie('authToken', token, options).json({
                    successMessage: 'Cookie update successful',
                    name: name,
                    token: token
                })
            })
    } catch (error) {
        next(error)
    }
}

module.exports.updateUserStatus = async (req, res, next) => {
    const currentUserId = req.myId;
    const { status } = req.body

    try {
        await registerModel.findByIdAndUpdate(currentUserId, {
            status: String(status)
        })
            .then(async (user) => {
                const [token, options] = await signToken(
                    {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        createdAt: user.createdAt,
                        profileImage: user.profileImage,
                        status: String(status),
                        theme: user.theme
                    }
                )
                res.status(200).cookie('authToken', token, options).json({
                    successMessage: 'Cookie update successful',
                    status: status,
                    token: token
                })
            })
    } catch (error) {
        next(error)
    }
}