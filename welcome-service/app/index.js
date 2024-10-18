const express = require("express")
const axios = require("axios")
const app = express()

app.get("/", (req, res) => {
  res.send("Welcome to my awesome app v2!")
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

app.get("/users", async (req, res) => {
    try {
        const response = await axios.get("http://user-service:3001/users")
        res.json(response.data)
    } catch (err) {
        console.log("[-] Err -> ", err)
        res.status(500).send("Error obtaining users")
    }
})

