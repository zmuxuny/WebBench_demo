const express = require('express');
const app = express();
const PORT = 8080;

app.get('/hello', (req, res) => {
    res.send('Hello, WebBench!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
