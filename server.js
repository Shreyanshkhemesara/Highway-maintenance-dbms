const http = require('http')
const port = 3000
const path = require('path');
const express = require('express')
const cors = require('cors');
const { table } = require('console');
const {Client} = require('pg');
const { urlencoded, query } = require('express');
var bodyParser = require('body-parser')

const input = require('prompt-sync')();

const tables = ['highway', 'company', 'accident']


const app = express();
app.set('view enginge' , 'ejs');
app.use(express.static(__dirname));


app.use(express.json());
app.use(express.urlencoded());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname)+'/public/home.html')
}) 




app.get('/Display', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/display.html')
})


app.get('/Insert', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/insert.html')
})

app.get('/Delete', (req, res)=> {
    res.sendFile(path.join(__dirname + '/public/delete.html'))
})


app.get('/table', cors(), (req, res) => {
    for (let [key, value] of Object.entries(tables)) {
        console.log(key, value);
    }
    
    
    console.log(req.query)
    let q = "select *";
    // for (let [key, value] of Object.entries(tables)) {
    //     if(value == req.query.table) {
    //         q += " * from value"
    //     }
    // }   
    q += " from highways." + req.query.table;
    console.log(q);
    const client_t = new Client({
        host: 'localhost',
        user: 'postgres',
        port: 5432,
        password: 'admin',
        database: '202001121_db'
    });
    client_t.connect()
    .then(()=>console.log("Client connected successfully"))
    .then(()=>client_t.query('set search_path to \"highways\"'))
    .then(()=>client_t.query(`${q}`)
    .then((res_s)=> {
        console.log(res_s.rows)
        res.render(path.join(__dirname)+`/views/${req.query.table}_view.ejs`, {data: (res_s)});
    })
    
    )

    // res.redirect('/')
})


//redirecting insert requests to where they should go:

app.get('/highway_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/highway_insert.ejs'));
})
app.get('/company_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/company_insert.ejs'));
})
app.get('/citizen_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/citizen_insert.ejs'));
})
app.get('/issues_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/issues_insert.ejs'));
})
app.get('/tolls_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/tolls_insert.ejs'));
})
app.get('/accidents_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/accidents_insert.ejs'));
})
app.get('/place_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/place_insert.ejs'));
})
app.get('/position_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/position_insert.ejs'));
})
// managing the insertion in table

var urlencodedParser = bodyParser.urlencoded({ extended: false})


const client_t = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'admin',
    database: '202001121_db'
});

const ser = new Client(client_t);
ser.connect().then(()=>{console.log('connected')})


app.post('/tolls_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {nh_id, collection_1, collection_2 } = req.body;
    ser.query(`Insert into highways.tolls values($1, $2, $3)`, [
        nh_id,
        collection_1,
        collection_2
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/citizen_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        aadhar_no,
        email_id,      
        first_name,
        last_name,
        age
      }= req.body;
    ser.query(`Insert into highways.citizen values($1, $2, $3, $4, $5)`, [
        aadhar_no,
        email_id,      
        first_name,
        last_name,
        age
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/accidents_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        year,
        tot_accidents,
        tot_deaths
      }= req.body;
    ser.query(`Insert into highways.accidents values($1, $2, $3)`, [
        year,
        tot_accidents,
        tot_deaths
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/issues_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        nh_id,
        name,
        repair_cost
      }= req.body;
    ser.query(`Insert into highways.issues values($1, $2, $3)`, [
        nh_id,
        name,
        repair_cost
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/company_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        gst_num,
        company_name,
        government,
        date_start,
        date_end,
        material,
        maintenance_time
      }= req.body;
    ser.query(`Insert into highways.position values ($1, \'temp-name\', \'temp-name\',\'temp-name\')`,[
        company_name
    ]).catch((err)=>console.log(err))
    ser.query(`Insert into highways.company values($1, $2, $3, $4, $5,$6,$7)`, [
        gst_num,
        company_name,
        government,
        date_start,
        date_end,
        material,
        maintenance_time
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/position_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        company_name,
        ceo,
        president,
        vice_president
      }= req.body;
      console.log(president)
    ser.query(`Insert into highways.position values($1, $2, $3, $4)`, [
        company_name,
        ceo,
        president,
        vice_president
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/place_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        city_name,
        state_name
      }= req.body;
    ser.query(`Insert into highways.place values($1, $2)`, [
        city_name,
        state_name
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})


app.post('/highway_inserted', urlencodedParser, (req, res)=>{
    console.log(req.body)
    const {
        nh_id,
        length,
        city_name,
        year,
        status
      }= req.body;
    ser.query(`Insert into highways.tolls values($1, $2, $3)`, [
        nh_id,
        100,
        200
    ])
    .catch((err)=> {
        if(err)
        console.log('already existed| now inserting in highways')
        else console.log('temperorrily inserte in tolls')
    })
    
    ser.query(`Insert into highways.services values($1, $2, $3)`, [
        nh_id,
        100,
        200
    ])
    .catch((err)=> {
        if(err)
        console.log('already existed| now inserting in highways')
        else console.log('temperorrily inserte in tolls')
    })
    // ser.query(`Insert into highways.issues values($1, $2, $3)`, [
    //     nh_id,
    //     'temp-issue',
    //     0
    // ])
    // .catch((err)=> {
    //     if(err)
    //     console.log('already existed| now inserting in highways')
    //     else console.log('temperorrily inserte in tolls')
    // })
    ser.query(`Insert into highways.highway values($1, $2, $3, $4, $5)`, [
        nh_id,
        length,
        city_name,
        year,
        status
    ])
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
})




//delete requests:

app.get('/highway_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/highway_delete.ejs'));
})
app.get('/company_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/company_delete.ejs'));
})
app.get('/citizen_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/citizen_delete.ejs'));
})
app.get('/issues_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/issues_delete.ejs'));
})
app.get('/tolls_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/tolls_delete.ejs'));
})
app.get('/accidents_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/accidents_delete.ejs'));
})
app.get('/place_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/place_delete.ejs'));
})
app.get('/position_delete', (req, res) => {
    res.render(path.join(__dirname+'/views/position_delete.ejs'));
})

app.get('/tolls_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.tolls where nh_id=\'${req.query.nh_id}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})


app.get('/citizen_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.citizen where aadhar_no=\'${req.query.aadhar_no}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})


app.get('/accidents_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.accidents where year=\'${req.query.year}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})



app.get('/issues_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.issues where nh_id=\'${req.query.nh_id}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})



app.get('/company_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.company where gst_num=\'${req.query.gst_num}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})


app.get('/position_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.position where company_name=\'${req.query.company_name}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})


app.get('/place_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.place where city_name=\'${req.query.city_name}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})


app.get('/highway_deleted', (req, res)=>{
    console.log(req.query);
    const Que = `delete from highways.highway where nh_id=\'${req.query.nh_id}\'`;
    console.log(Que)
    ser.query(Que)
    .then(()=>console.log('ran'))
    .then((response) => res.json(response))
    .catch((err)=> {
        if(err){
            console.log(err)
            res.sendFile(path.join(__dirname) + '/public/error.html')
        } else {
            res.redirect('/')
        }
    })
    // res.redirect('/')
})
app.listen(port, (err)=>{
    console.log('connected')
})
