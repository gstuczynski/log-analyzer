
const lineReader = require('line-reader');
const NodeCouchDb = require('node-couchdb');


const couch = new NodeCouchDb({
    auth: {
        user: 'grzes',
        password: '123'
    }
});

lineReader.eachLine('import-logs/short-log', (line, last)=> {

let lineArr = line.split(" ");



    couch.uniqid().then(ids=>{
        const id = ids[0];
        couch.insert('nasa-logs',{
            _id: id,
            host:lineArr[0],
            date: lineArr[3].substring(1),
            method: lineArr[5].substring(1),
            resource: lineArr[6],
            response_code: lineArr[7]
        })
    })





if(last){
    console.log("File Loaded");
}
})


