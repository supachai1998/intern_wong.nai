const express = require('express')
const cors = require('cors')
const axios = require("axios");
const servURL = "http://localhost:9000/trips"



const app = express()
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))
app.listen(5000, () => {
  console.log('start server')
})

app.get('/', (req, res) => {
  res.status(200).send("Hi.")
})

// ERR_HTTP_HEADERS_SENT Cannot set headers after they are sent to the client ยังแก้ไม่ได้
app.get('/trips',async (req, res) => {
  const { method, query } = req
  res.setHeader('Content-Type', 'application/json');
  if (method === "GET") {
    const {data}  =await axios.get(servURL)
                    .then(data => data)
                    .catch(err => err);
    let matchData = []
    // find data
    const { keywords, findBy } = query
    if (keywords) {
      const keyword = keywords.trim().toLowerCase()
      switch (findBy) {
        case "title":
          matchData = data.filter(({ title }) => {
            const match = title.trim().toLowerCase().indexOf(keyword) > -1
            return match
          })
          break;
        case "description":
          matchData = data.filter(({ description }) => {
            const match = description.trim().toLowerCase().indexOf(keyword) > -1
            return match
          })
          break;
        case "tags":
          matchData = data.filter(({ tags }) => {
            const match = tags.filter(tag => tag.trim().toLowerCase().indexOf(keyword) > -1).length > 0
            return match
          })
          break;

        default:
          matchData = data.filter(({ title, description, tags }) => {
            const match = title.trim().toLowerCase().indexOf(keyword) > -1 ||
              description.trim().toLowerCase().indexOf(keyword) > -1 ||
              tags.filter(tag => tag.trim().toLowerCase().indexOf(keyword) > -1).length > 0
            return match
          })
        break;
      }
      // if not found any data from matchData
      if (!matchData.length) res.status(404).json({
        status: "success",
        error: "not found data"
      })
      res.status(200).json(matchData)
    }
    // if no keywords   send all data
    res.status(200).json(data)
  }
  res.status(405).json({
    status: "error",
    error: "Method not allowed"
  })
})


