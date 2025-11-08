const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { q } = req.query;
    const apiKey = process.env.API_KEY;
    const url = `https://newsapi.org/v2/everything?q=${q}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ message: response.statusText });
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
