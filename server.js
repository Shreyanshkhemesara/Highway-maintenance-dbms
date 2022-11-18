const http = require('http')
const port = 3000
const path = require('path');
const express = require('express')
const cors = require('cors');
const { table } = require('console');
const {Client} = require('pg');
const { urlencoded } = require('express');
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
    q += " from " + req.query.table;
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
app.get('/government_official_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/government_official_insert.ejs'));
})
app.get('/tolls_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/tolls_insert.ejs'));
})
app.get('/accidents_insert', (req, res) => {
    res.render(path.join(__dirname+'/views/accidents_insert.ejs'));
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
    .catch((err)=> console.log(err))
    // res.redirect('/')
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
    .catch((err)=> console.log(err))
    // res.redirect('/')
})





app.listen(port, (err)=>{
    console.log('connected')
})
