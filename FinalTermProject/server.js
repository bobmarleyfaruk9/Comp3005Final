const http = require('http')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const fs = require('fs')

const routes = require('./routes/index.js')



const  app = express() 

const PORT = process.env.PORT || 3000


app.use(express.static(__dirname + '/public'))

// app.get(['/add'], (request, response) => {
// 	response.sendFile(__dirname + '/views/add.html')
//   }) 

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/index.html', routes.index)
app.get('/books', routes.find)
app.get('/add', routes.add)
app.get('/book/*', routes.bookDetails)

app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`) 
		console.log(`To Test:`)

		console.log("The books can be searched by ")
		console.log('http://localhost:3000/books?title=Lord')
 
		console.log('http://localhost:3000/index.html')
		
	}
})
