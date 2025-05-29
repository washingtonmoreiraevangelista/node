import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middleware/check-session-id'

// request : informaçoes que vem da requisiçao

// reply : resposta que vai ser enviada para o cliente

// request Query : vem da URL com query params. parametros que vem na URL

// request Body : vem do corpo da requisiçã Ele contém tudo: headers, body, params, query, etc. corpo da requisição

// request Params : vem da URL com parâmetros. parametros que vem na URL



// quando dois usuarios usar as trasnascoes ao mesmo tempo que fique regitrado qual foi o usuario que fez a transação e fique salvo o id do usuario

// Eles são armazenados no navegador e podem conter informações como um ID de sessão ou preferências do usuário. 
// Quando você faz login, o cookie pode guardar um identificador para manter você autenticado mesmo após atualizar a página. 
// Mesmo sem estar logado, os cookies podem armazenar suas ações localmente, como histórico de navegação ou preferências de uso.
// quando o usuario  for criar a primeira  transação vai anotar para ele um sessionId para ele ser identificado e quando for lista  so vai validar apenas transações daquele sessionId


export async function transactionsRoutes(app: FastifyInstance) {
app.addHook('preHandler', async (request, reply) => {

  console.log(`[${request.method}] ${request.url}`)
})

  //inserir
  app.post('/', async (request, reply) => {
    // validação do body
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),

    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    // procura dentro dos cokkies se tem um sessionId
    let sessionId = request.cookies.sessionId

    // se não tiver um sessionId ele cria um novo sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        //  60 segundos, 60 minutos, 24 horas, 7 dias
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    }


    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    // HTTP CODE o tipo de retorno da api
    return reply.status(201).send("Adicionado com sucesso !")

  })


  //listar
  app.get('/', {
    // valida se tem um sessionId, e executar o middleware antes de executar a rota
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {

    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      // se tiver um sessionId ele retorna as transações daquele sessionId
      .where('session_id', sessionId)
      .select()

    //  vc pode retornar um objeto ou um array de objetos return {transactions}, ou return transactions formar direta
    return { transactions }

  })


  // lista por id
  app.get('/:id', {
    // valida se tem um sessionId, e executar o middleware antes de executar a rota
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = request.cookies


    if (!getTransactionParamsSchema) {
      console.log("Id não encontrado")
    }

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first()

    return { transaction }

  })

  //  resumo soma de todos os valores
  app.get('/summary', {

    // valida se tem um sessionId, e executar o middleware antes de executar a rota
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {

    const { sessionId } = request.cookies

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })


}