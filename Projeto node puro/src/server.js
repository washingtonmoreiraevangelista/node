import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './router.js';
import { extractQueryParams } from './utils/extract-query-params.js';


const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {

    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handle(req, res)
  }


  res.writeHead(404).end()
})

server.listen(3333)



// res.end : Usado com o módulo HTTP nativo do Node.js , Finaliza a resposta, mas não formata nada automaticamente, definir os headers e o corpo manualmente
// res.writeHead :  Ele define o código de status HTTP e os cabeçalhos da resposta,Você deve chamar res.writeHead() antes de res.end()
// res.send: Envia uma resposta automaticamente com o tipo de conteúdo correto (como JSON, texto, HTML etc.)
// # é usado para definir propriedades ou métodos privados em classes JavaScript