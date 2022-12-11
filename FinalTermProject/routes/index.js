const url = require('url')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose() 
const db = new sqlite3.Database('data/bookstore.db')

const headerFilePath = __dirname + '/../views/header.html'
const addFilePath = __dirname + '/../views/add.html'




function handleError(response, err) {

  response.writeHead(404)
  response.end(JSON.stringify(err))
}


function send_find_data(request, response, rows) {
  fs.readFile(headerFilePath, function(err, data) {
    if (err) {
      handleError(response, err);
      return;
    }
    response.writeHead(200, {   
      'Content-Type': 'text/html'
    })
    response.write(data)

    for (let row of rows) {
      response.write(`<p><a href= 'book/${row.book_name}'>${row.book_name} ${row.author_name}</a></p>`)
    }

    
  })
}

function send_book_details(request, response, rows) {
  fs.readFile(headerFilePath, function(err, data) {
    if (err) {
      handleError(response, err);
      return;
    }
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.write(data)
    for (let row of rows) {

      response.write(`<h1>Book Details:</h1>`)
      response.write(`<h1>Name:${row.book_name} </h1>`)
      response.write(`<h1>Author: ${row.author_name} </h1>`)
      response.write(`<h1>Genre: ${row.genre} </h1>`)
      response.write(`<h1>Number of Pages: ${row.page_count} </h1>`)
      response.write(`<h1>ISBN: ${row.ISBN} </h1>`)
      response.write(`<h1>Price: ${row.price} </h1>`)


    }
  })
}



exports.index = function(request, response) {
  fs.readFile(headerFilePath, function(err, data) {
    if (err) {
      handleError(response, err);
      return; 
    }
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.write(data) 
  })
}

function parseURL(request, response) {
  const PARSE_QUERY = true 
  const SLASH_HOST = true 
  let urlObj = url.parse(request.url, PARSE_QUERY, SLASH_HOST)
  return urlObj

}



exports.find = function(request, response) {

  let urlObj = parseURL(request, response);
  let sql = "SELECT book_name, author_name FROM books WHERE book_name LIKE '%";

  if (urlObj.query['title']) {
    let title = urlObj.query['title']
    let temp_title=""

    for(let i=0; i<title.length; i++){
      if(i==title.length-1){
        sql=sql+temp_title+title.charAt(i)+"%'"
      }
      else if(title.charAt(i)==" "){
        sql=sql+temp_title+"%"
        temp_title=""
      }
      else temp_title+=title.charAt(i)
    }
  } 

  db.all(sql, function(err, rows) {
    send_find_data(request, response, rows)
  })
}

exports.bookDetails = function(request, response) {
  let modified_name=""
  let urlObj = parseURL(request, response)
  let name = urlObj.path
  name = name.substring(name.lastIndexOf("/") + 1, name.length)

  for(let i=0; i<name.length; i++){
    
    if(name.charAt(i)=="%" && name.charAt(i+1)=="2" && name.charAt(i+2)=="0"){
      modified_name+=" "
      i+=2
    }
    else modified_name+=name.charAt(i)
  }
  let sql = "SELECT book_name, genre, ISBN, author_name, page_count, price FROM books WHERE book_name='"+modified_name+"'" 
  
  db.all(sql, function(err, rows) {
    send_book_details(request, response, rows)
  })
}

exports.add = function(request, response) {
  fs.readFile(addFilePath, function(err, data) {
    if (err) {
      handleError(response, err);
      return;
    }
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.write(data)

    
  })
 
}

