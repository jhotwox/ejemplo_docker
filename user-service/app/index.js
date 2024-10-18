const express = require("express")
const app = express()

const users = [
    {id: 1, name: "Pepe"},
    {id: 2, name: "Juan"},
    {id: 3, name: "Luis"}
]

app.get("/users", (req, res) => {
    res.json(users)
})

app.listen(3001, () => {
    console.log("User service is running on port 3001")
})