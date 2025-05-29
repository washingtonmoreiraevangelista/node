import { Knex } from 'knex'


//  aquivo de tipos .d.ts  sao definiçoes de tipos para o typescript


declare module 'knex/types/tables' {
  // dizer quais tableas temos no banco de dados
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }

}