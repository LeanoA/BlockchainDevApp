# Blockchain development application 

Blockchain application with destributed ledger.
It use sha256 to generate a particular hash that start with four zeros.

## Getting Started

```bash
npm install
npm app.js
```

The server runs on port 8080 by default. To run in diferents server in diferents port put its number in the argument:

```bash
npm app.js 8081
```

where the port are going to be 8081.

There are five routes:

- http://localhost:8080/register - (POST) To register a node. We will be sending an array of URLs.
- http://localhost:8080/transactions - (POST) to send transaction with the atributes `from`, `to`and `amount`. 
- http://localhost:8080/mine - (GET) To Add the transactions to a particular blockchain.
- http://localhost:8080/blockchain - (GET) Return the blockchain
- http://localhost:8080/resolve - (GET) Resolve the conflict between nodes. 

## Development

This project uses EditorConfig to standardize text editor configuration. Visit https://editorconfig.org for details.

This project use ESLint to detect suspicious code in JavaScript files. Visit https://eslint.org. for details.

   