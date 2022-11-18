const {Client} = require('pg');
const input = require('prompt-sync')();

const client_t = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'admin',
    database: '202001121_db'
});

const q = input('Enter your sql query: ');

client_t.connect()
.then(()=>console.log("Client connected successfully"))
.then(()=>client_t.query('set search_path to \"highways\"'))
.then(()=>client_t.query(`${q}`, (err, res)=>{
    if(!err) {
        console.log('output of query:')
        console.table(res.rows)
    } else {
        console.log(err)
    }
    client_t.end();
}))
