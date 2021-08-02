const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const alert = require('alert-node');

mongoose.connect('mongodb://localhost:27017/webtech',{ useNewUrlParser: true },(err)=>{
	if(!err){
		console.log("connection succeeded");
	}else{
		console.log("connection error: " + err);
	}
});

var employeeSchema = new mongoose.Schema({
	Name: String,
	Designation: String,
	Address: String,
	Salary: Number,
	State: String,
	created:{type: Date,default: Date.now}
});

var Employee = mongoose.model("Employee",employeeSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.get('/',(req,res)=>{
	res.render("video");
});

app.get('/list',(req,res)=>{
	Employee.find({}).then(employees =>{
		res.render("home",{employees : employees});
	}).catch(err=>{
		console.log(err);
	});
});

app.get('/new',(req,res)=>{
  res.render("new");
});

app.get('/new/:idno',(req,res)=>{
  Employee.find({_id:req.params.idno})
    .then(searchedEmployee=>{
      Employee.deleteOne({_id: searchedEmployee[0]._id})
        .then(employee=>{
          alert("edit this employee:");
        })
        .catch(e=>{
          console.log(e);
        })
      res.render("new1",{searchedEmployee:searchedEmployee});
    })
    .catch(e=>{
      console.log(e);
    });
});

app.post('/new',(req,res)=>{
  var fullname = req.body.fullname;
  var designation = req.body.designation;
  var salary = req.body.salary;
  var state = req.body.state;
  var address = req.body.address;
  var x = {
    Name: fullname,
    Designation: designation,
    Address: address,
    Salary: salary,
    State: state
  };
  Employee.create(x);
  res.redirect('/list');
});

app.post('/delete/:idno',(req,res)=>{
  var search = {_id: req.params.idno};
  Employee.deleteOne(search)
    .then(employee=>{
      res.redirect('/list');
    })
    .catch(e=>{
      console.log(e);
    });
});

app.listen(4000,()=>{
	console.log("server running");
});
