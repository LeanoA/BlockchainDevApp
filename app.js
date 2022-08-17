const Block = require('./block')
const Blockchain = require('./blockchain')
const Transaction = require('./transaction')
const BlockchainNodes = require('./blockchainNode')

const fetch = require('node-fetch')

const express = require('express')
const { response } = require('express')
const app = express()

// console.log(process.argv)
const arguments = process.argv
let PORT = 8080

if (arguments.length >2) {
    PORT = arguments[2]
}

// body Parser for JSON
app.use(express.json())

let transactions = []
let nodes = []
let allTransactions = []

let genesisBlock = new Block()
let blockchain = new Blockchain(genesisBlock)

app.get('/resolve', (req, res) => {
    // Resolve conflicts between nodes
    nodes.forEach(node => {

        fetch(`${node.url}/blockchain`)
        .then(response => response.json())
        .then(otherBlockchain => {
            if(blockchain.blocks.length < otherBlockchain.blocks.length) {
                allTransactions.forEach(transaction => {

                    fetch(`${node.url}/transactions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(transaction)
                    }).then(response => response.json())
                    .then(_ => { //eslint-disable-line
                        // result ignored
                        // The unique routes to add blockchain to the node is throw mine
                        fetch(`${node.url}/mine`)
                        .then(response => response.json())
                        .then(_ => { //eslint-disable-line
                            // ignore the result
                            // Fetch the updated blockchain by making a request again
                            // get the update blockchain
                            fetch(`${node.url}/blockchain`)
                            .then(response => response.json())
                            .then(updatedBlockchain => {
                                console.log(updatedBlockchain)
                                blockchain = updatedBlockchain
                                res.json(blockchain)
                            })
                        })
                    })

                })
            } else {
                res.json(blockchain)
            }

        })

    })

})


app.post('/nodes/register', (req, res) => {
    const urls = req.body
    urls.forEach( url => {
        // console.log(url)
        const node = new BlockchainNodes(url)
        nodes.push(node)
    })

    res.json(nodes)
})


app.post('/transactions',(req, res) => {
    const to = req.body.to
    const from = req.body.from
    const amount = req.body.amount

    let transaction = new Transaction(from, to, amount)
    transactions.push(transaction)
    res.json(transactions)
})

app.get('/mine', (req, res) => {
    let block = blockchain.getNextBlock(transactions)
    blockchain.addBlock(block)

    // Add transaction to All transaction
    transactions.forEach(transaction => {
        allTransactions.push(transaction)
    })

    // Clear transactios out
    transactions = []

    res.json(block)
})


app.get('/blockchain', (req, res) =>{
    res.json(blockchain)
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
