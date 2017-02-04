var hrstart = process.hrtime()
var lineReader = require('line-reader');
var Map = require("collections/map");
var reqSuccesRegex = / 2\d{2} /,       //code: 2XX
    reqAccesDenidedRegex =/ 40(1|7|3) /,     //code 401 or 407
    reqNotFoundRegex = / 404 /,
    resourceAddressReg = /"\w{3,4} (\/\S*)*/,  //address with request type in [0]("GET /x/x"), separate address in [1]("/x/x")
    plDomainReg =/[a-z]+\.pl\s/, // /\w+\.pl\W\S+/,///^\w+\.pl\W\S+/,
    successCount = 0,
    count = 0,
    accesDenidedCount = 0,
    mostPopMissRes="",
    plDomainRes = "";

var missingResurceMap = new Map(),
    plDomainMap = new Map();


lineReader.eachLine('access_log_Jul95', function(line, last) {
  count ++;

    if(reqSuccesRegex.exec(line)){
        successCount++; //number of success (2xx code)
    }

    if(reqAccesDenidedRegex.exec(line)){
        accesDenidedCount++;//number of access denided (401 or 407 code)
    }

    if(reqNotFoundRegex.exec(line)){
      //map with request with code 404
        missingResurceMap = createDomainMap(line, missingResurceMap, resourceAddressReg, 1)
    }
    plDomainMap = createDomainMap(line, plDomainMap, plDomainReg)
  

  if(last){

        plDomainRes = findMaxGenerateMsg(plDomainMap, plDomainRes)
        mostPopMissRes = findMaxGenerateMsg(missingResurceMap, mostPopMissRes)

        console.log("Total requests(number of lines -1): "+ (count-1));
        console.log("Number of requests handled successfully: "+successCount);
        console.log("Number of requests resulted in access being denied: "+accesDenidedCount);
        console.log("Most popular missing resource: "+mostPopMissRes+" with number of missing: "+ missingResurceMap.max());
        console.log("Most frequent .pl domain: "+plDomainRes+" with number : "+ plDomainMap.max()); 
        var hrend = process.hrtime(hrstart);
        console.log("Execution time: ", hrend[0], hrend[1]/1000000); 
  }

});

var createDomainMap = function(line, map, reg, g=0){
//if regex greate group exec return table, g define where is domain
          if(reg.exec(line)){
            var domain = reg.exec(line)[g];
           // console.log(domain)
            var count = map.get(domain);
            map.set(domain,count ? count+1 : 1 );
          }
          return map;
}

var findMaxGenerateMsg = function(map, msg){
//found domain with max count, can be few domain with max
    map.forEach(function(v,k){
            if(v==map.max()){
                msg+= k+ " ";
            }
        })
    return msg;
}