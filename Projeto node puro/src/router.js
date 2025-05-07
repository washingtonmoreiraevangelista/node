import { randomUUID } from 'node:crypto';
import { Database } from './dataBase.js';
import { buildRouterPath } from './utils/build-route-path.js';

// query Parameters:  URL  stateful => fica na url,filtras, paginação , não obrigatorios, ex: users?userId=1&name=Jhon
// route Parameters: identificação de recurso, fica na url, obrigatorio, ex: /users/1
// request body:  dados enviados de infomaçoes não fica na url, ex: { name: 'Jhon', email: 'jhon@email.com' }

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRouterPath('/users'),
    handle: (req, res) => {

      const { search } = req.query
      const users = database.select('users', search ? {
        name: search,
        email: search,
      } : null)

      return res
        .end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRouterPath('/users'),
    handle: (req, res) => {
      const { name, email, age } = req.body || {}

      const user = {
        id: randomUUID(),
        name,
        email,
        age,
      }

      database.insert('users', user)

      return res.writeHead(201).end('Criado com sucesso!')
    }
  },
  {
    method: 'PUT',
    path: buildRouterPath('/users/:id'),
    handle: (req, res) => {
      const { id } = req.params
      const { name, email, age } = req.body

      database.update('users', id, { name, email, age })

      return res.writeHead(204).end()

    }
  },
  {
    method: 'DELETE',
    path: buildRouterPath('/users/:id'),
    handle: (req, res) => {
      const { id } = req.params
      database.delete('users', id)
      return res.writeHead(204).end()
    }
  }

]