export default handler = async (req, res) => {
    if (req.method === 'GET') {
        res.json("Hello World!");
    }
}