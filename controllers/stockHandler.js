var expect = require('chai').expect;
var MongoClient = require('mongodb');
var yahoo = require("yahoo-stocks");

const CONNECTION_STRING = process.env.DB;

module.exports = class StockHandler {
  
  constructor() {
  }

  getPrice(stock) {
    return yahoo.lookup(stock).then(response => {
          var price = response.currentPrice.toString();
          return price;
      });
  }
  
  getLikes(stock) {
    return MongoClient.connect(CONNECTION_STRING)
                      .then(function(db) {
                              var dbo = db.db("freecodecamp");
                              dbo.createCollection("stocks", function(err, res) {
                                    if (err) throw err;
                                  });
                              return dbo.collection("stocks")
                                .findOne({ stock: stock })
                                .then(function(res) {
                                  //console.log(res);
                                  if (res == null) {
                                    var newstock = {stock: stock, likes: 0, iplist: []};
                                    return dbo.collection("stocks")
                                              .insertOne(newstock)
                                              .then(function(res2) {
                                                //console.log(res2);
                                                return res2.likes;
                                              })
                                              .catch((err)=>{
                                                console.error(err)
                                            });
                                  } else {
                                    return dbo.collection("stocks")
                                              .findOne({ stock: stock })
                                              .then(function (res2) {
                                                //console.log(res2);
                                                return res2.likes;
                                              })
                                              .catch((err)=>{
                                                console.error(err)
                                            });
                                  }
                             });
          });
  }
  
  addLike(stock, ip) {
    return MongoClient.connect(CONNECTION_STRING)
                      .then(function(db) {
                              var dbo = db.db("freecodecamp");
                              dbo.createCollection("stocks", function(err, res) {
                                    if (err) throw err;
                                  });
                              return dbo.collection("stocks")
                                .findOne({ stock: stock })
                                .then(function(res) {
                                  //console.log(res);
                                  if (res == null) {
                                    var newstock = {stock: stock, likes: 1, iplist: [ip]};
                                    return dbo.collection("stocks")
                                              .insertOne(newstock)
                                              .then(function(res2) {
                                                //console.log(res2);
                                              })
                                              .catch((err)=>{
                                                console.error(err)
                                            });
                                  } else {
                                    if (res.iplist.includes(ip)) {
                                      return res.likes;
                                    } else {
                                      var newvalues = { $set: {likes: res.likes + 1, iplist: [...res.iplist, ip]} };
                                      return dbo.collection("stocks")
                                                .findAndModify({ stock: stock }, {}, newvalues)
                                                .then(function (res2) {
                                                  //console.log(res2);
                                                })
                                                .catch((err)=>{
                                                  console.error(err)
                                              });
                                    }
                                  }
                             });
          });
  }
  
}