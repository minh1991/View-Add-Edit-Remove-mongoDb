var express = require('express');
var router = express.Router();

//kết nối mongo với NJS
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'contact';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Server đã chạy");
  const db = client.db(dbName);
  client.close();
});






/* GET thêm dữ liệu. */
router.get('/themdl', function(req, res, next) {
  res.render('themdl', { title: 'themdl' });
});

/* xử lý dữ liệu thêm. */
router.post('/themdl', function(req, res, next) {
  var dulieu = {
    "ten": req.body.namedb,
    "sdt": req.body.phonedb
  }
  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('memberdb');
    // Insert some documents
    collection.insert( dulieu, function(err, result) {
      assert.equal(err, null);
      console.log("Thêm dữ liệu thành công");
      callback(result);
    });
  }
  // Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
      client.close();
    });
  });

  // sau khi thêm dữ liệu thành công sẽ quay về trang chủ
  res.redirect('/viewdl')
});

/* GET xem dữ liệu đã nhập */
router.get('/', function(req, res, next) {
  const findDocuments = function(db, callback) {
    // lấy ra document của collection (Định nghĩa file document)
    const collection = db.collection('memberdb');
    // tìm document
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });}
    //END định nghĩa file document
  // kết nối với server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  const db = client.db(dbName);
  //sử dụng file document, trả về dữ liệu (biến dulieu)
    findDocuments(db, function(dulieu) {
      //đẩy vào views 
      res.render('viewdl', { title: 'viewdl', data: dulieu });
      client.close();
    });
  });
});

/* GET Xóa dữ liệu */
const ChangeObjectId = require('mongodb').ObjectId;
router.get('/remove/:iddl', function(req, res, next) {
  var iddl= ChangeObjectId(req.params.iddl);
  //câu lệnh remove
  //gọi hàm xóa
  const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('memberdb');
    // Delete document where a is 3
    collection.deleteOne({ _id : iddl }, function(err, result) {
      assert.equal(err, null);
      console.log("Đã xóa thành công");
      
      callback(result);
    });
  }
  //két nối hàm xóa
  // Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
      removeDocument(db, function() {
        client.close();
        res.redirect('/viewdl');
      });
    });
  // test thử lệnh lấy ID
  //  console.log(iddl);
  
});

/* Sửa dữ liệu */
router.get('/fixdl/:idfix', function(req, res, next) {
  var idfix= ChangeObjectId(req.params.idfix);
  //hàm tìm dữ liệu
  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('memberdb');
    // Find some documents
    collection.find({_id: idfix}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Tìm thấy dữ liệu cần sửa");
      callback(docs);
    });
  }
  // kết nối với server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  const db = client.db(dbName);
  //sử dụng file document, trả về dữ liệu (biến dulieu)
    findDocuments(db, function(dulieu) {
      //đẩy vào views 
      //console.log(dulieu);
      res.render('fixdl', { title: 'fixdl', data: dulieu });
      client.close();
    });
  });
});
  //đẩy dữ liệu từ views sang mongo
  router.post('/fixdl/:idfix', function(req, res, next) {
    // id cần sửa lấy ở phần sử dữ liệu
    var idfix= ChangeObjectId(req.params.idfix);
    // dữ liệu cần sửa lấy ở trang thêm mới
    var dulieu = {
      "ten": req.body.namedb,
      "sdt": req.body.phonedb
    }
    const updateDocument = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('memberdb');
      // Update document where a is 2, set b equal to 1
      collection.updateOne({ _id : idfix }
        , { $set: dulieu }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
      });
    }
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
    updateDocument(db, function() {
      client.close();
      res.redirect('/viewdl');
    });
  });
});
  


module.exports = router;
