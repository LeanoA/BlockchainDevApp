const sha256 = require('js-sha256')
const Block = require('./block')

class Blockchain {
    constructor (genesisBlock) {
        this.blocks = []
        this.addBlock(genesisBlock)
    }

    addBlock(block){
        if(this.blocks.length == 0) {
            block.previousHash = "0000000000000000" // 16 ceros va a ser el Hash Previo
            block.hash = this.generateHash(block)
        }

        this.blocks.push(block)
    }

    getNextBlock(transaccions) {
        // Creo el nuevo bloque
        let block = new Block()
        transaccions.forEach( (transaccion) => {
            block.addTransaction(transaccion)
        })

        // Necesito informacion del bloque anterior
        let previousBlock = this.getPreviousBlock()

        // Creamos el indice
        block.index = this.blocks.length

        // Obtenosmo el hash anterior
        block.previousHash = previousBlock.hash

        block.hash = this.generateHash(block)

        return block
    }

    getPreviousBlock(){
        return this.blocks[ this.blocks.length -1 ]
    }

    generateHash(block) {
        let hash = sha256(block.key)

        // Pedimos que comience con 4 ceros
        // para obtener el hash real
        while(!hash.startsWith('0000')) {
            block.nonce += 1
            hash = sha256(block.key)
            console.log(hash)
        }

        return hash
    }
}

module.exports = Blockchain
