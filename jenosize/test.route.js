const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const testRoute = express.Router();
testRoute.use(bodyParser.json());

const apiKey = 'AIzaSyA4ntjmXjhHODop09ibDT9EJ-rRNTemqj4';

// Get restaurants around Bangkok
testRoute.route('/restaurants').get((req, res, next) => {

    const location = '13.733868, 100.526018';
    const radius = 1000;
    const type = 'restaurant';

    var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}}&keyword=${type}&key=${apiKey}`,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json(response.data.results);
        })
        .catch(function (error) {
            console.log(error);
        });

})

// Get result for game24
testRoute.route('/game24').post((req, res, next) => {
    let num1 = req.body.num1;
    let num2 = req.body.num2;
    let num3 = req.body.num3;
    let num4 = req.body.num4;

    const target = 24;
    const operators = ['+', '-', '*', '/'];
    const numbers = [num1, num2, num3, num4];

    function solve24(numbers) {
        if (numbers.length == 1) {
            return numbers[0] == target;
        }

        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                if (i != j) {
                    const a = numbers[i];
                    const b = numbers[j];
                    const remaining = numbers.filter((x, index) => index != i && index != j);
                    for (let op of operators) {
                        let result = 0;
                        if (op == '+') {
                            result = a + b;
                        } else if (op == '-') {
                            result = a - b;
                        } else if (op == '*') {
                            result = a * b;
                        } else if (op == '/') {
                            if (b == 0) {
                                continue;
                            }
                            result = a / b;
                        }
                        if (solve24([...remaining, result])) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    let answer = solve24(numbers);
    console.log(answer);

    if (answer == true) {
        res.json({answer: "YES"});
    } else {
        res.json({answer: "NO"})
    }
})

module.exports = testRoute;