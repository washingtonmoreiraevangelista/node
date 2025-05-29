import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'


// expect:  siginifca espero que a lista de transacoes seja igual a lista de transacoes

// antes de cada teste preciso rodar o migrate:rollback e migrate:latest e preciso do banco de dados vazio para isso usamos o beforeEacha cada teste apago o banco e crio um novo banco

//  escrever  os testes com it , um teste não pode depender do outro teste,sempre criar cada teste partindo do princicipio como se os outros não existem




describe('Transactions routes', () => {

  // antes de executar os testes
  beforeAll(async () => {
    await app.ready()
  })

  // fecha depois que finalizar 
  afterAll(async () => {
    await app.close()
  })

  // exclui e cria o banco de dados antes de cada teste
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })


  it('shold be able to creat a new transactions', async () => {

    // fazer chamada http para criar uma transacao
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

      // testa se criar trasaction foi criado com sucesso ou funciona  entao precisa do  expect
      .expect(201)

  })

  // criar uma transacao  transacoes
  it('shold be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    // lista todas a transacoaes
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)


    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    ])
  })



  // lista todas a transacoaes pelo id
  it('shold be able to get a specific transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)


    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    )
  })


  //  cira o resumo das transacoes
  it('shold be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    // pega o cookies da transacao criada
    const cookies = createTransactionResponse.get('Set-Cookie')

    // cria uma transacao de debito
    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    // buscaa o resumo das transacoes
    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    // verifica se o resumo das transacoes é igual a 3000
    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })






})
