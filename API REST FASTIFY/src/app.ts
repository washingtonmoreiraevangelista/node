import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'


export const app = fastify()

// tem que registrar o cookie antes de registrar as rotas
app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

