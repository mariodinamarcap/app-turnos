function soloBarbero(req, res, next) {
    const claveEsperada = `Bearer ${process.env.ADMIN_TOKEN}`;

    if (req.headers.authorization !== claveEsperada) {
        return res.status(401).json({ error: "No autorizado" });
    }

    next();
}

module.exports = { soloBarbero };
