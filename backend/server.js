const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectToMongo=require('./db');
connectToMongo();


app.use(express.json())

// routes
app.use('/api/auth',require('./routes/auth'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`DocQueue app listening on http://localhost:${PORT}`);
});
