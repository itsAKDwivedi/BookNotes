import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';


const app = express();
const port = 3000;
const url = 'https://covers.openlibrary.org/b/isbn/';
const noOfRandomBooks = 6;
let idx = [];
let imageUrls = [];
let result = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new Client({
  connectionString: 'postgresql://postgres:XNYkjbEefdxaTTJwdviwpBLakUySMkvN@roundhouse.proxy.rlwy.net:26998/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

//Backend functions

async function mainPage(){
    try {
        const data = await db.query('SELECT * FROM books ORDER BY rating DESC');
        result = data.rows;
        const n = result.length;
        idx=[];
        imageUrls=[];
        for(let i=0; i<noOfRandomBooks; i++){
            let k = Math.floor(Math.random() * n);
            if(idx.includes(k)){
                i--;
                continue;
            }
            idx.push(k);
        }
        
        for(let i=0; i<noOfRandomBooks; i++){
            imageUrls.push(url + result[idx[i]].id +'-M.jpg');    
        }
    }
    
    catch(error){
        console.error('Error loading page:', error);
    };
}

async function fetchAndSaveImage(i) {
    try {
            const response = await axios.get(imageUrls[i], { responseType: 'stream' });
            const writer = fs.createWriteStream(`./public/resources/${i}.jpg`);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

app.get("/api/fetch-image", async (req, res) => {
    try {
        let i = req.query.index;
        await fetchAndSaveImage(i);
        res.json({path: `./resources/${i}.jpg`});
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get("/api/new-img", async (req, res) => {
    try {
        let newIsbn = req.query.isbn;
        imageUrls[0] = (url + newIsbn +'-M.jpg');
        await fetchAndSaveImage(0);
        res.json({path: './resources/0.jpg'});
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});


//Endpoints

app.get("/", async (req, res) => {
    await mainPage();
    res.render("index.ejs",{
        idx: idx,
        books: result,
        active: 'All'
    });
});

app.get('/genre', async(req, res)=>{
    try {
        const gen = req.query.gen;
        const data = await db.query('SELECT * FROM books WHERE genre LIKE $1 ORDER BY rating DESC', [`%${gen}%`]);
        const result = data.rows;
        const n = result.length;
        idx=[];
        imageUrls=[];
        for(let i=0; i<Math.min(noOfRandomBooks, n); i++){
            let k = Math.floor(Math.random() * n);
            if(idx.includes(k)){
                i--;
                continue;
            }
            idx.push(k);
        }
        if(n<noOfRandomBooks){
            for(let i=n; i<noOfRandomBooks; i++){
                let k = Math.floor(Math.random() * n);
                idx.push(k);
            }
        }
        for(let i=0; i<noOfRandomBooks; i++){
            imageUrls.push(url + result[idx[i]].id +'-M.jpg');    
        }

        res.render("index.ejs",{
            idx: idx,
            books: result,
            active: gen
        });
    }
    
    catch(error){
        console.error('Error loading page:', error);
    };
});

app.get('/add', (req, res)=>{
    res.render('form.ejs');
})

app.get('/view', async(req, res)=>{
    const id = req.query.id;
    try{
        const data = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        await mainPage();
        res.render('view.ejs', {
            active: 'none',
            book: data.rows[0],
            idx: idx,
            books: result
        });
    } catch(error){
        console.error(error);
    }
});

app.get('/edit', async(req, res)=>{
    const id = req.query.id;
    try{
        const data = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        res.render('edit.ejs', {
            book: data.rows[0]
        });
    } catch(error){
        console.error(error);
    }
});

app.get('/delete', async(req, res)=>{
    const id = req.query.id;
    try {
        await db.query('DELETE FROM books WHERE id=$1', [id]);
        res.render('success.ejs', {
        status: 'Book deleted successfully ❤️',
        active: 'none'
        });
    } catch (error) {
        res.render('success.ejs', {
            status: error,
            active: 'none'
            });
    }
})

app.post('/add', async(req, res)=>{
    const { isbn, bname, author, genre, notes, intro } = req.body;
    const rating = parseFloat(req.body.rating);

    const query = 'INSERT INTO books (id, name, author, rating, genre, notes, intro) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [isbn, bname, author, rating, genre, notes, intro];
    try {
        await db.query(query, values);
        res.render('success.ejs', {
        status: 'Book added successfully ❤️',
        active: 'none'
        });
    } catch (error) {
        if(error=='error: duplicate key value violates unique constraint "books_pkey"'){
            error = "Uff🤦‍♂️, Book already exist !"
        }
        res.render('success.ejs', {
            status: error,
            active: 'none'
            });
    }
});

app.post('/edit', async(req, res)=>{
    const { isbn, bname, author, genre, notes, intro } = req.body;
    const rating = parseFloat(req.body.rating);

    const query = 'UPDATE books SET name=$1, author=$2, rating=$3, genre=$4, notes=$5, intro=$6 WHERE id=$7';
    const values = [bname, author, rating, genre, notes, intro, isbn];   
    try {
        await db.query(query, values);
        res.render('success.ejs', {
        status: 'Book updated successfully ❤️',
        active: 'none'
        });
    } catch (error) {
        res.render('success.ejs', {
            status: error,
            active: 'none'
            });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 
