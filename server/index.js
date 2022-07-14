const express = require("express");
const app = express();
const cors = require("cors");

//Middleware
app.use(express.json());
app.use(cors());

//Routes

// register and login routes
app.use("/auth", require("./routes/jwtAuth.js"));

app.use('/dashboard', require("./routes/dashboard"));

let port = process.env.port || 4000;
app.listen(port, () => {
    console.log('server currently running on port ' + port);
});

