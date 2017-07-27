var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/test';




/* GET home page. */

router.get('/', function (req, res, next) {

  res.render('index');

})

router.post('/one', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.collection('person').insertOne({ name: req.body.name, age: req.body.age, gender: req.body.gender, mobile: req.body.mobile }, function (err, result) {
      if (err) {
        console.log('error inserting');
      } else {
        console.log('successfully inserted' + result)
      }
      res.redirect('/person')
      db.close();
    });

  });
})

router.get('/person', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.collection('person').find({}).toArray(function (err, result) {
      if (err) {
        console.log('error getting data')
      } else {
        console.log('data is' + JSON.stringify(result))
      }
      var data = {
        data: result
      }
      res.render('person', data)
      db.close();
    });

  });
})

router.get('/update/:id', function (req, res, next) {
  var id = req.params.id
  console.log('id :' + id)

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.collection('person').find({ _id: new mongodb.ObjectID(id) }).toArray(function (err, docs) {

      if (err) throw err;
      var one = {
        docs: docs[0],
      }
      res.render('update', one)

      db.close();

    });

  });

});


router.post('/person/:id', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {

    if (err) { throw err; }
    console.log("Connected correctly to server.");
    var collection = db.collection('person');

    var name = req.body.name;

    var age = req.body.age;

    var gender = req.body.gender;

    var mobile = req.body.mobile;
    console.log('result :' + req.params.id);
    console.log('result :' + req.body.subject)
    collection.updateOne({ '_id': new mongodb.ObjectID(req.params.id) },
      { $set: { 'name': name, 'age': age, 'gender': gender, 'mobile': mobile } }, function (err, result) {

        if (err) { throw err; }
        console.log('result :' + result)


        db.close();
        res.redirect('/person');


      });

  });


});

router.get('/delete/:id', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {

    if (err) { throw err; }
    console.log("Connected correctly to server.");
    var collection = db.collection('person');
    collection.deleteOne({ '_id': new mongodb.ObjectID(req.params.id) }, function (err, result) {

      if (err) { throw err; }
      console.log('deleted')
      res.redirect('/person');

      db.close();



    });

  });

});

router.get('/data/:id', function (req, res, next) {
  var id = req.params.id
  console.log('id :' + id)

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.collection('person').find({ _id: new mongodb.ObjectID(id) }).toArray(function (err, docs) {

      if (err) throw err;
      var one = {
        docs: docs[0],
      }
      res.render('data', one)

      db.close();

    });

  });

});

module.exports = router;
