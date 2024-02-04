import jwtPackage from 'jsonwebtoken';
const { verify } = jwtPackage;

export async function authMiddleware(req, res, next) {
    try {

    } catch (error) {
        
    }
    const { authToken } = req.cookies;
    if (authToken) {
        const decodeToken = await verify(authToken, process.env.SECRET);
        req.myId = decodeToken.id;
        next();
    } else {
        res.status(400).json({
            error: {
                errorMessage: ['Please login first.']
            }
        })
    }
}