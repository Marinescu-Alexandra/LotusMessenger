import { User } from '../models/authModel.js';
import { hash, compare } from 'bcrypt'
import formidable from 'formidable';
import path from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path'
import { copyFile } from 'fs/promises'
import { BadRequestError, ConflictError, UnauthorizedError } from '../errors/errors.js'
import { verifyFilename } from '../utils/verifyFilename.js'
import jwtPackage from 'jsonwebtoken';
import validatorPackage from 'validator';

const { isEmail } = validatorPackage;
const { sign } = jwtPackage;

async function signToken(id, email, username, createdAt, profileImage, status, theme) {
    const token = sign({
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
    if (email && !isEmail(email)) {
        errors.push('Please provide a valid email.')
    }

    if (errors.length > 0) {
        throw new BadRequestError(errors);
    } 
}

function checkForRegisterErrors({ username, email, password }) {
    const errors = []
    if (!username) {
        errors.push('Please provide a user name.')
    }
    if (!email) {
        errors.push('Please provide an email.')
    }
    if (!password) {
        errors.push('Please provide a password.')
    }

    if (email && !isEmail(email)) {
        errors.push('Plese provide a valid email.')
    }

    if (errors.length > 0) {
        throw new BadRequestError(errors);
    }
}

export async function userRegister(req, res, next) {
    const { username, email, password } = req.body;

    try {
        checkForRegisterErrors({ username, email, password })

        const checkUser = await User.findOne({
            email: email,
        })

        if (checkUser) {
            throw new ConflictError('The provided email is already in use.');
        }

        const userCreate = await User.create({
            username,
            email,
            password: await hash(password, 10),
        });

        const [token, options] = await signToken(userCreate._id, userCreate.email, userCreate.username, userCreate.createdAt, userCreate.profileImage, userCreate.status, userCreate.theme)

        res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Registration complete.', token
        })
        
        
    } catch (error) {
        next(error)
    }
}

export async function userLogin(req, res, next) {
    const { email, password } = req.body;

    try {
        checkForLoginErrors({ email, password })

        const checkUser = await User.findOne({
            email: email
        }).select('+password');

        if (!checkUser) {
            throw new BadRequestError('Email not valid. Please use another email or register.');
        }

        const matchPassword = await compare(password, checkUser.password);

        if (!matchPassword) {
            throw new UnauthorizedError('Password not valid.');    
        }

        const [token, options] = await signToken(checkUser._id, checkUser.email, checkUser.username, checkUser.createdAt, checkUser.profileImage, checkUser.status, checkUser.theme)
        res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Login successful', token
        })
        
    } catch (error) {
        next(error)
    }
}

export function userLogout(req, res) {
    res.status(201).cookie('authToken', '').json({
        success: true
    })
}

export async function updateUserProfileImage(req, res, next) {
    const currentUserId = req.myId;
    var form = formidable({})
    try {
        const [fields, files] = await form.parse(req)

        const profileImageName = fields['profileImageName']

        const verify = verifyFilename(profileImageName[0], path.resolve('frontend/public/userProfileImages/'))
        if (!verify) {
            throw new UnauthorizedError("Ilegall file name")
        }

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const newPath = join(__dirname + `../../../frontend/public/userProfileImages/${profileImageName}`)

        files['profileImage'][0].originalFilename = profileImageName
        await copyFile(files['profileImage'][0].filepath, newPath)

        const user = await User.findByIdAndUpdate(currentUserId, {
            profileImage: String(profileImageName)
        })

        const [token, options] = await signToken(user._id, user.email, user.username, user.createdAt, String(profileImageName), user.status, user.theme)

        res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Cookie update successful',
            profileImagePath: profileImageName,
            token: token
        })

    } catch (error) {
        next(error)
    }
}

export async function updateUserTheme(req, res, next) {
    const currentUserId = req.myId;
    const { theme } = req.body

    try {
        const user = await User.findByIdAndUpdate(currentUserId, {
            theme: String(theme)
        })

        const [token, options] = await signToken(user._id, user.email, user.username, user.createdAt, user.profileImage, user.status, String(theme))

        res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Cookie update successful',
            theme: theme,
            token: token
        })

    } catch (error) {
        next(error)
    }
}

export async function updateUserName(req, res, next) {
    const currentUserId = req.myId;
    const { name } = req.body

    try {
        const user = await User.findByIdAndUpdate(currentUserId, {
            username: String(name)
        })

        const [token, options] = await signToken(user._id, user.email, String(name), user.createdAt, user.profileImage, user.status, user.theme)

        res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Cookie update successful',
            name: name,
            token: token
        })

    } catch (error) {
        next(error)
    }
}

export async function updateUserStatus(req, res, next) {
    const currentUserId = req.myId;
    const { status } = req.body

    try {
        const user = await User.findByIdAndUpdate(currentUserId, {
            status: String(status)
        })

        const [token, options] = await signToken(user._id, user.email, user.username, user.createdAt, user.profileImage, String(status), user.theme)

        res.status(200).cookie('authToken', token, options).json({
            successMessage: 'Cookie update successful',
            status: status,
            token: token
        })

    } catch (error) {
        next(error)
    }
}