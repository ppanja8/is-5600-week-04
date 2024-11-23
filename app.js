const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api')
const middleware = require('./middleware')

// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.get('/products', listProducts)
app.get('/', handleRoot);
// app.use(express.json())
app.use(express.static(__dirname + '/public'))

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// Register middleware
app.use(middleware.cors)
app.use(bodyParser.json())
// Register the routes

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.get('/', api.handleRoot)
app.delete('/products/:id', api.deleteProduct)
app.put('/products/:id', api.updateProduct)

// Register the error handler
app.use(middleware.handleError)
// Register the not found handler
app.use(middleware.notFound)