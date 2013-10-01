db = db.getMongo().getDB("scanner"); 
db.auth("scanner","vcW6rEixic3kdBWj"); 

map = function() {
    hour = this.time.getHours();

    emit({hour: hour, talkgroup: this.talkgroup}, {count: 1});
}

reduce = function(key, values) {
  var count = 0;

  values.forEach(function(v) {
    count += v['count'];
  });

  return {count: count};
}

db.transmissions.mapReduce(map, reduce, {out: "call_volume"});