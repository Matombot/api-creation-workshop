require('dotenv').config()
// add code in here to create an API with ExpressJS
const express = require('express');
// import the dataset to be used here
const garments = require('./garments.json');
const app = express();


// enable the static folder...
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// import the dataset to be used here
const jwt = require('jsonwebtoken');

app.use(express.json())

const PORT = process.env.PORT || 4017;

function authenticateToken(req, res, next) {
   // const token = req.query.token;

    //console.log();
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        res.sendStatus(401);
         return;
     }
    const decoded = jwt.verify(token, 'thisis-Mysecret-token@0208');
    const {username} = decoded;

    console.log(username);
    if (username && username === 'Matombot') {
        next();
    }
    else {
        res.sendStatus(401)
    }

}
app.get('/api/name', authenticateToken, function (req, res) {
    res.json({
        name: "tshifhiwa Matombo"
    })
});
app.post('/api/token', function (req, res) {
    const {username} = req.body;

    const token = jwt.sign({
        username
    }, 'thisis-Mysecret-token@0208');

    res.json({
        token
    });
});
app.get('/api/garments',authenticateToken , function (req, res) {

    const gender = req.query.gender;
    const season = req.query.season;

    const filteredGarments = garments.filter(garment => {
        // if both gender & season was supplied
        if (gender != 'All' && season != 'All') {
            return garment.gender === gender
                && garment.season === season;
        } else if (gender != 'All') { // if gender was supplied
            return garment.gender === gender
        } else if (season != 'All') { // if season was supplied
            return garment.season === season
        }
        return true;
    });

    res.json({
        garments: filteredGarments
    });
});

app.get('/api/garments/price/:price', authenticateToken, function (req, res) {
    const maxPrice = Number(req.params.price);
    const filteredGarments = garments.filter(garment => {
        // filter only if the maxPrice is bigger than maxPrice
        if (maxPrice > 0) {
            return garment.price <= maxPrice;
        }
        return true;
    });

    res.json({
        garments: filteredGarments
    });
});
app.post('/api/garments', authenticateToken, (req, res) => {
    // get the fields send in from req.body
    const {
        description,
        img,
        gender,
        season,
        price
    } = req.body;
    if (!description || !img || !price) {
        res.json({
            status: 'error',
            message: 'Please fill all the empty fields',
        });
    }

    else if (garments.find(garment =>{return garment.description === description} )){

   
    res.json({
        status: 'error',
        message: 'data already exists',
    });
     }
    else {
        garments.push({
            description,
            img,
            gender,
            season,
            price
        });
        res.json({
            status: 'success',
            message: 'New garment added',

        });
    }
});
//  function generateAccessToken(user) {

//      return jwt.sign(user, process.env.SECRET-TOKEN, { expiresIn: '24h' })
//  }

 

 
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});