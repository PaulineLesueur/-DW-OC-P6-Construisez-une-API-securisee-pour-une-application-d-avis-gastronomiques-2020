const jwt = require('jsonwebtoken'); //used to setup the token system

module.exports = (req, res, next) => {
    try { // if the user's token matches with the token we gave to him
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'The userID is invalid';
        } else {
            next(); //then he can navigate the application
        }
    }
    catch (error) { //if the token doesn't matches, the connection isn't authorized
        res.status(401).json({ error: error | "Unauthorized access"});
    }
};