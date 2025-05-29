import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies.sessionId

  // se não tiver um sessionId ele retorna um erro
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized"
    })
  }

}
