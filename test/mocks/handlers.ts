import { rest } from 'msw'

export const handlers = [
  rest.get('http://example.com/test', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set({
        'Content-Type': 'application/json',
      }),
      ctx.json({
        hello: 'Hello World'
      })
    )
  })
]
