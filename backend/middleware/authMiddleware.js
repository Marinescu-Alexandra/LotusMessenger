import jwtPackage from 'jsonwebtoken';
const { verify } = jwtPackage;

export async function authMiddleware(req, res, next) {
    const { authToken } = req.cookies;

    if (authToken) {
        const decodeToken = verify(authToken, process.env.SECRET);
        req.myId = decodeToken.id;
        next();
    } else {
        res.status(401).json({
            error: {
                errorMessage: ['Please login first.']
            }
        })
    }

}