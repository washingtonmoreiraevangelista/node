import fs from 'node:fs/promises';

const databaseUrl = new URL('../db.json', import.meta.url)
export class Database {
  #database = {}

  // carrega dados de um arquivo JSON, e se o arquivo não existir (ou der erro), ele chama o método #persist() para criá-lo
  constructor() {

    fs.readFile(databaseUrl, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  // metodo escrever dados no arquivo
  #persist() {
    fs.writeFile(databaseUrl, JSON.stringify(this.#database, null, 2))
  }

  // metodo
  select(table, search) {
    const data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })

    }

    return data
  }

  // metodo
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }
}
