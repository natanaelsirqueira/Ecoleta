import { Request, Response } from 'express'

import knex from '../database'

export default class ItemsController {
  async index(_request: Request, response: Response) {
    const items = await knex('items').select('*')

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.2.7:3333/uploads/${item.image}`
      }
    })

    return response.json(serializedItems)
  }
}
