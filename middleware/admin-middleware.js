const adminMiddleware = (req, res, next) => {
    const { role } = req.userInfo; // Assuming userInfo is already attached to req by authMiddleware

    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied! Admin rights required.'
        });
    }

    next();
}

module.exports = adminMiddleware;