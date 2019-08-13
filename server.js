import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import * as Router from 'koa-router'

const router = new Router()

var server = async function() {
  const app = new Koa(),
        host = process.env.HOST || '127.0.0.1',
        port = process.env.PORT || 3000

  // Import and Set Nuxt.js options
  const config = require('./nuxt.config.js')
  config.dev = !(app.env === 'production')

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  router.get('/api', async (ctx, next) => {
    ctx.body = 123
  });
  // app.use(async (ctx, next) => {
  //   ctx.set('Access-Control-Allow-Origin', '*');
  //   ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  //   await next();
  // })
  app.use(router.routes()).use(ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

server()