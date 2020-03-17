// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error) {
        return console.log('Error:'+error)
    } 
    
    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Kumar',
    //     age: '22'
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user')
    //     } 
    // })
    //const id = new ObjectId("5e539eeb1dff173d94af6d51");
    // db.collection('users').findOne({ _id: new ObjectId("5e539eeb1dff173d94af6d51")}, (error, result) => {
    //     if(error) {
    //         return console.log(error)
    //     }
        
    //     console.log(result)
    // })

    // db.collection('users').find({age:'28'}).toArray((error, result)=>{
    //     console.log(result)
    // })

    // db.collection('tasks').insertMany([{
    //         description: 'Udemy Course on Node JS',
    //         completed: true
    //     },
    //     {
    //         description: 'Workflow for MyCypress Blog',
    //         completed: false
    //     },
    //     {
    //         description: 'Book tickets to TTD',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Failed to insert the tasks')
    //     }

    //     console.log(result.ops)
    // })
    
    // db.collection('tasks').findOne({_id: new ObjectID('5e53a19b49278e52ecd92ae3')}, (error, tasks)=>{
    //     console.log("Find One Output Below")
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log(tasks);
    // })

    
    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     console.log("Find Output Below")
    //     if(error){
    //         return console.log(error)
    //     } 

    //     console.log(tasks)
    // })

    // db.collection('users').updateOne({_id: new ObjectID('5e539821c232fc43c8b95c43')},{$inc: {
    //     age: 20
    // }}).then((result)=> {
    //     console.log(result)
    // }).catch((error) =>{
    //     console.log(error)
    // })

    db.collection('tasks').updateMany({}, {$set: {
        completed: true
    }}).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

    db.collection('users').deleteMany({
        age: 28
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(erro)
    })

    //Convert age to number from string
    // db.collection('users').find().forEach( function(obj) {
    //     obj.my_value= new NumberInt(obj.my_value);
    //     db.my_collection.save(obj);
    // });

    // db.collection('users').find().forEach(function(data) {
    //     db.collection('users').updateMany({_id:data._id},{$set:{age:parseInt(data.age)}});
    // })
})