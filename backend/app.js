const mongoose= require('mongoose');             //import mongoose module
const express = require('express');
const app = express();
app.use(express.json());                         //middleware in application

//set up default mongoose connection
mongoose.connect("mongodb://localhost:27017/grocerydata", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//create Schema
const schema = new mongoose.Schema({

    groceryItem : {
        type: String,
        required : true
    },
    isPurchased: {
        type: Boolean,
        required: true,
        default: false
    }    
});


//create model as GroceryList
const GroceryList = mongoose.model('GroceryList', schema);

//  push data by request from body
app.post('/grocery/add', (req, res) => {
    var itemdata = new GroceryList ({
        groceryItem: req.body.groceryItem,
        isPurchased: req.body.isPurchased
    });

    itemdata.save().then((docs) => {                  
        console.log('Success', docs)
        res.end("Success");                            //itemdata is save 
    }, (err) => {
        console.log(err)                               // itemdata is not save
    
});

    
});

// find the data 
app.get('/grocery/getall', function (req, res) {
    GroceryList.find({}, (err, data) => {
        res.json(data)
    })
});

// update response one by one
app.put('/grocery/updatePurchaseStatus', function (req, res) {

    GroceryList.findOneAndUpdate({ _id:  req.body._id }, { isPurchased:req.body.isPurchased }, { returnOriginal: false }).then((result) => {
       console.log('Success', result)
        res.json(result);
    });
});

// delete record of id  
app.delete('/grocery/deleteGroceryItem', function (req, res) {

    GroceryList.deleteOne({ _id: req.body._id }).then((result) => {
        console.log(result);
        res.json(result);
    }, (err) => console.log(err));
})

 app.listen('9000',()=>{
     console.log("App is running on 9000 port")
 })