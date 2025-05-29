import {config} from 'dotenv'
import { z } from 'zod'

// configura o dotenv para pegar as variaveis de ambiente
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  // diz em qual ambiente esta rodando o projeto
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(5555),
})


 const _env = envSchema.safeParse(process.env)


if(_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
} 

export const env = _env.data