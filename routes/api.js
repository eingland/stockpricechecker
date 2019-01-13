/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var StockHandler = require('../controllers/stockHandler.js');

var stockPrices = new StockHandler();

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      if (Array.isArray(req.query.stock)) {
        if (req.query.like) {
           await stockPrices.addLike(req.query.stock[0], req.connection.remoteAddress);
           await stockPrices.addLike(req.query.stock[1], req.connection.remoteAddress);
        }
        res.json({"stockData":[{"stock": req.query.stock[0],"price": await stockPrices.getPrice(req.query.stock[0]),"rel_likes": await stockPrices.getLikes(req.query.stock[0])- await stockPrices.getLikes(req.query.stock[1])}, 
                               {"stock": req.query.stock[1],"price": await stockPrices.getPrice(req.query.stock[1]),"rel_likes": await stockPrices.getLikes(req.query.stock[1])- await stockPrices.getLikes(req.query.stock[0])}]});
      } else {
        if (req.query.like) {
           await stockPrices.addLike(req.query.stock, req.connection.remoteAddress);
        }
        res.json({"stockData":{"stock": req.query.stock,"price": await stockPrices.getPrice(req.query.stock),"likes": await stockPrices.getLikes(req.query.stock)}});
      }
    });
};
