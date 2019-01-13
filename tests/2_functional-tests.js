/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.body.stockData.stock, 'goog', 'stock name is goog');
          assert.property(res.body.stockData, 'price', 'stockData has price property');
          assert.property(res.body.stockData, 'likes', 'stockData has likes property');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.body.stockData.stock, 'goog', 'stock name is goog');
          assert.property(res.body.stockData, 'price', 'stockData has price property');
          assert.isAbove(res.body.stockData.likes, 0, 'likes is greater than 0');
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end(function(err, res2){
            assert.equal(res.body.stockData.stock, 'goog', 'stock name is goog');
            assert.property(res.body.stockData, 'price', 'stockData has price property');
            assert.equal(res.body.stockData.likes, res2.body.stockData.likes, 'likes are the same when called twice');
            done();
          });
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: [ 'goog', 'msft' ]})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.body.stockData[0].stock, 'goog', 'first stock name is goog');
          assert.equal(res.body.stockData[1].stock, 'msft', 'second stock name is msft');
          assert.property(res.body.stockData[0], 'price', 'stockData[0] has price property');
          assert.property(res.body.stockData[1], 'price', 'stockData[1] has price property');
          assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0, 'rel_likes when added together should equal zero');
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: [ 'goog', 'msft' ], like: true})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.body.stockData[0].stock, 'goog', 'first stock name is goog');
          assert.equal(res.body.stockData[1].stock, 'msft', 'second stock name is msft');
          assert.property(res.body.stockData[0], 'price', 'stockData[0] has price property');
          assert.property(res.body.stockData[1], 'price', 'stockData[1] has price property');
          assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0, 'rel_likes when added together should equal zero');
          done();
        });
      });
    });

});
