const express = require('express');
const bodyParser = require('body-parser');
const { connectToDb, getDb } = require('./config/db');
const cors = require('cors'); 
const path = require('path');

const app = express();
const port = 1666;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

let db;

connectToDb((err) => {
    if (!err){
        app.listen(port, ()=>{
            console.log("Сервер запущен");
        });
        db = getDb();
    } else {
        console.log(`Ошибка: ${err}`);
    }
});


app.use(cors());

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/list/newlist', (req, res) => {
    db.collection('lists').insertOne(req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Ошибка при добавлении в базу данных");
        } else {
            res.status(200).send("Данные успешно добавлены в базу данных");
        }
    });
});

app.post('/list/insert', (req, res)=>{
    db.collection('lists').findOneAndUpdate(
        { seed: req.body.key }, 
        { $push: { todos: {name:req.body.name, desc:req.body.desc} } }, 
        { returnOriginal: false } 
      )
      .then(updatedDocument => {
        console.log('Обновленный документ:', updatedDocument.value);
      })
      .catch(error => {
        console.error('Произошла ошибка:', error);
      });
});

app.post('/list/get', (req, res) => {
    const key = req.body.key;

    if (!key) {
        return res.status(400).json({ error: 'Отсутствует ключ' });
    }

    db.collection('lists').findOne({ seed: key })
    .then(document => {
        if (!document) {
            return res.status(404).json({ error: 'Документ с указанным ключом не найден' });
        }
        res.status(200).json(document);
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
        res.status(500).json({ error: 'Произошла ошибка при поиске документа' });
    });
});
