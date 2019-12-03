const express = require('express')
const models = require('./models')
// Needed to destructure Rebel attributes for Posting
const bodyParser = require('body-parser')

const app = express()
// To use body-parser throughout index.js
app.use(bodyParser.json())

app.get('/rebels', (request, response) => {
  models.Rebels.findAll().then((rebels) => {
    response.send(rebels)
  })
})

app.get('/rebels/:identifier', (request, response) => {
  // If id is a number (double negative), which it is, send GET request
  /* Note: typeof won't work here, it will only either return a string 
     or a number in If-Else statement or only return either id or callSign */
  if (!isNaN(request.params.identifier)) {
    models.Rebels.findAll({ 
      where: { id: request.params.identifier } 
    }).then((rebel) => {
      response.send(rebel);
    })
  // Else send GET request for callSign as 'identifier', which is NaN— a string
  } else {
    models.Rebels.findAll({ 
      where: { callSign: request.params.identifier } 
    }).then((rebel) => {
      response.send(rebel);
    })  
  }
})  

app.post('/rebels', (request, response) => {
  // Deconstructor for body
  const { name, callSign, rank } = request.body
  // If new Rebel name, callSign or rank is not in body, send 400 status message
  if (
     !name || 
     !callSign || 
     !rank
  ) {
    response.status(400).send('The following attributes are required: name, callSign, rank')
  /* Else create attributes for new Rebel in models.Rebels, not models.Heroes. LOL
     Then send 201 status for new Rebel */  
  } else {
    models.Rebels.create({ name, callSign, rank }).then((newRebel) => {
      response.status(201).send(newRebel)  
    })
  }  
})

const port = process.env.PORT ? process.env.PORT : 1337
app.listen(port, () => { console.log(`Listening on port ${port}`) })


