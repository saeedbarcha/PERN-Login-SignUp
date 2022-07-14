const express = require('express');
const router = express.Router();
const pool = require('../db');   
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');
// Registration

router.post('/register', validInfo, async (req, res) => {

    try {
         // Take apart req.body (name, email, pass)
            const { name, email, password } = req.body;
           
        // Check if email already exists (if so, throw error)
            const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
                email
            ]);

            if (user.rows.length > 0) {
                return res.json("An account is already linked to that email!");
              } 
              

              
        // Bcrypt password
              
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            
            const bcryptPassword = await bcrypt.hash(password, salt);

        // Insert details in db
            const newUser = await pool.query("INSERT INTO USERS(user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *", [
                name, email, bcryptPassword
            ]);
            
        
        // Generate JWT 
            const token = jwtGenerator(newUser.rows[0].user_id);
            res.json({ name, token });
        
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', validInfo, async (req, res) => {
    try {
        
        // req.body
        const { email, password } = req.body;
        
        // error if no such user
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if(user.rows.length === 0) {
            return res.status(401).json("Password or Username is incorrect, please reenter.");
        }

        // password = db password?

        const passwordValid = await bcrypt.compare(password, user.rows[0].user_password);
        
        if(!passwordValid) {
            return res.status(401).json("Password or Email is Incorrect.");
        }


        // provide token

        const token = jwtGenerator(user.rows[0].user_id);
        const name = user.rows[0].user_name;
        res.json({ name, token});

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

    router.post("/verified", authorization, (req, res) => {
        try {
            res.json(true);

        } catch (err) {
            res.status(500).send('Server Error');     
        }
    });

module.exports = router;