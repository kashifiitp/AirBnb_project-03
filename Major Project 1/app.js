const express=require('express');

const app=express();
const mongoose=require("mongoose");
const listing=require("./model/listing.js")
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");




const MONGOURL='mongodb://127.0.0.1:27017/wonderlust';

main().then((res)=>{
    console.log("connection is succsesfully");
    
}

).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGOURL);
}
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"public")));

app.get("/" , (req , res)=>{
    res.send("port")
    
})
app.get("/listings" , async(req , res)=>{
   const  allListings=await listing.find({});
    res.render("./listings/index.ejs" , {allListings});
});

// app.get("/textListing" ,  async (req , res )=>{
//   let SampleListening=   new listing({
//     title:"MY new villa",
//     description:"By the  Beach",
//     price:1200,
//     location:"calangute , Goa", 
//    country:"india",
//   });

//   await SampleListening.save()

//   console.log("sample was saved");
//   res.send("succesful testing")
  
// });

//new Route
app.get("/listings/new" ,(req , res)=>{
    res.render("./listings/new.ejs")
})

//Show Route
app.get("/listings/:id" , async (req , res)=>{
   let  {id}=req.params;
      const Listing=  await  listing.findById(id);

      res.render("./listings/show.ejs" , {Listing})

});

// CREATE Post 

app.post("/listings" , async(req , res)=>{
const NewListing=   new listing(req.body.listings)
   await NewListing.save().then((res)=>{
    console.log(res);
    
}).catch((err)=>{
    console.log(err);
    
})
res.redirect("/listings");
  
  
})

//EDIT ROUTE

app.get("/listings/:id/edit" , async(req , res)=>{
  let  {id}=req.params;
      const Listing=  await  listing.findById(id);
      res.render("./listings/edit.ejs" , {Listing});
})

//Update

app.put("/listings/:id" ,async(req , res)=>{
    let  {id}=req.params;
await listing.findByIdAndUpdate(id , {...req.body.listings});
   res.redirect(`/listings/${id}`);
})


//DELETE route

app.delete("/listings/:id" , async(req , res)=>{
      let  {id}=req.params;
      let Deletetedlisting= await  listing.findByIdAndDelete(id);
      console.log(Deletetedlisting);
      res.redirect("/listings")
      
})



app.listen(8080, ()=>{
console.log("port is listening 8080");

})
