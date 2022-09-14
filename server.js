const bodyParser= require('body-parser')
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient


MongoClient.connect('mongodb+srv://stoner:stoner@cluster0.0ahacqh.mongodb.net/?retryWrites=true&w=majority')
  .then(client =>{
  const db = client.db('CRUD')
  const quotesCollection = db.collection('quotes')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.listen(3000, function() {
  console.log('listening on 3000')
})

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html')
// })
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html')

  db.collection('quotes').find().toArray()
    .then(results => {
      // console.log(results)
    res.render('index.ejs', {quotes: results})

    })
    .catch(error => console.error(error))
  
})

app.post('/quotes', (req, res) => {
  quotesCollection.insertOne(req.body)
  .then(result => {
    res.redirect('/')
  })
  .catch(error => console.error(error))
  console.log(req.body)
})

app.put('/quotes', (req, res) => {
  quotesCollection.findOneAndUpdate(
    { name: 'yoda' },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      upsert: true
    }
  )
  .then(result => {
    res.json('success')
   })
  .catch(error => console.error(error))
})

app.delete('/quotes', (req, res) =>{
  quotesCollection.deleteOne(
    { name: req.body.name },
  )
  .then(result => {
    res.json(`Deleted Darth Vader's quote`)
  })
  .catch(error => console.error(error))
})

})


