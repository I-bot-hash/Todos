const express = require("express");
const bp = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bp.urlencoded({extended:true}))


const mongodbUrl = process.env.MONGODB_URL || 'mongodb+srv://Isha:isha2002@cluster0.vn8cz.mongodb.net/toDoListDB?retryWrites=true&w=majority';
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connection made successfully");
}).catch(error=> {
    console.log(error);
})

const items = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});
const item = new mongoose.model("item",items);
const lst = new item({
    name: "Buy Chocalate"
});
const l = new item({
    name: "Buy banana"
});
const t = new item({
    name: "Buy apple"
});

var defaultItem = [lst,l,t];

const customlist = new mongoose.Schema({
    name: String,
    cust : [items]
})

const sagar = new mongoose.model("sagar",customlist)

// item.insertMany([
//     {name: "Buy Food"},
//     {name: "Buy Pizza"}
// ]).then(console.log("data Inserted")).catch(e=>{
//     console.log(e);
// })




app.get("/", function(req,res){
  
    item.find({})
.then(s=>{
    if(s.length===0){
        item.insertMany(defaultItem).then(console.log("succesfully inerted item")).catch(e=>{
                console.log(e);
        })
        res.redirect('/');
    }
    else{
        res.render("list",{kindOfDay : "today", newItems : s})
    }
  
   
})
.catch(error=>{
    console.log(error);
})
    
    
})
app.post("/delete", function(req,res){
    console.log(req.body.result);
    if(req.body.result==="today"){
        console.log("entered home route");
        const ch=req.body.check;

    console.log("this" + ch);
    item.deleteOne({_id : ch}).then(()=>{
        console.log("successfullly deleted");
    }).catch(err=>{
        console.log(err);
    })
    res.redirect("/")
    }else{
        console.log("entered else route");
        const id1=req.body.check;
        const res1 = req.body.result;
        console.log(res1)
        sagar.findOneAndUpdate({name:res1},{$pull: {cust: {_id: id1}}}).then(()=>{
            console.log("successfylly deleted from custom route");
        }).catch(e=>{
            console.log(e);
        })
        
        res.redirect("/"+res1)
    }
    
})
app.post("/", function(req,res){
    const t= req.body.lavesh;
    const val = req.body.subVal;
    const l1 = new item({
        name: t
    });
    if(val === "today"){
        l1.save().then(()=>{
            console.log("successfully saved into database");
        }).catch(e=>{
            console.log(e);
        });
        res.redirect('/')
    }
    else{
        sagar.findOne({name:val}).then(foundlist=>{
            console.log(foundlist);
            foundlist.cust.push(l1);
            foundlist.save().then(()=>{
                console.log("successfully saved into database");
            }).catch(e=>{
                console.log(e);
            });
            res.redirect("/"+val);
        }).catch(err=>{
            console.log(err);
        })
    }   
})

app.get("/:topic",function(req,res){
    const topi = req.params.topic
    console.log("successfully entered custom route");
    sagar.find({name:topi}).then(foundItems=>{
        
            if(foundItems.length==0){
                console.log("empty");
                const govind = new sagar({
                    name: topi,
                    cust : defaultItem
                });
                govind.save().then(()=>{
                    console.log("successfully saved from custom database");
                }).catch(e=>{
                    console.log(e);
                });
                res.redirect("/"+ topi);
            }
            else {
                console.log(foundItems);
                
                res.render("list", { kindOfDay: foundItems[0].name, newItems: foundItems[0].cust });
            }

        
    }).catch(error=>{
        console.log(error);
    })
    
    
    
})


app.listen(3000, function(){
    console.log("port started");
})
