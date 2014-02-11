var config      = require('config'),
    mongojs     = require('mongojs');

var db_config   = config.db_config,
    table_name  = config.table_name;
var db = mongojs(db_config + table_name, [table_name] );

function init_db(){
  var points = require('../parkcoord.json');
  var error_response = "data already exists - bypassing db initialization step\n";
  db[table_name].ensureIndex({'pos':"2d"}, function(err, doc){
    if(err){
      console.log(err);
      console.log(error_response);
    }else{
      console.log("index added on 'pos'");
    }
    db[table_name].insert(points, function(errr, docs){
      if(errr){
        console.log(errr);
      }else{
        console.log("map points added");
      }
      return;
    });
  });
} 

function flush_db(){
  console.log("Dropping the DB...");
  db[table_name].drop(function(err){
    if(err){
      console.log(err);
    }
    return;
  });
} 

function select_box(req, res, next){
  //clean these variables:
  var query = req.query;
  var lat1 = Number(query.lat1),
      lon1 = Number(query.lon1),
      lat2 = Number(query.lat2),
      lon2 = Number(query.lon2);
  var limit = (typeof(query.limit) !== "undefined") ? query.limit : 40;
  if(!(Number(query.lat1) 
    && Number(query.lon1) 
    && Number(query.lat2) 
    && Number(query.lon2)
    && Number(limit)))
  {
    res.send(500, {http_status:400,error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."});
    return console.error('could not connect to the database', err);
  }
  db[table_name].find( {"pos" : {'$within': { '$box': [[lon1,lat1],[lon2,lat2]]}}}).limit(limit).toArray(function(err,rows){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    //res.header("Content-Type:","application/json");
    res.send(rows);
    return rows;
  });
};
function select_all(req, res, next){
  console.log(db);
  db[table_name].find(function(err, rows){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(rows);
    return rows;
  });
};

module.exports = exports = {
  selectAll: select_all,
  selectBox: select_box,
  flushDB:   flush_db,
  initDB:    init_db
};
