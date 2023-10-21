const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectToMongo=require('./db');
const cors = require('cors');
connectToMongo();



app.use(express.json())
app.use(cors())
// routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/doctor',require('./routes/doctor'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`DocQueue app listening on http://localhost:${PORT}`);
});
