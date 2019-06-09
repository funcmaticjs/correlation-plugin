
// Capture and forward correlation IDs through different Lambda event sources
// by Yan Cui
// https://hackernoon.com/capture-and-forward-correlation-ids-through-different-lambda-event-sources-220c227c65f5

const uuidV4 = require('uuid/v4')

class CorrelationIdsPlugin {

  constructor() {

  }

  async env(ctx, next) {
    if (!ctx.state.correlation) {
      setCorrelationIds(ctx)
    }
    await next()
  }

  async start(ctx, next) {
    if (!ctx.state.correlation) {
      setCorrelationIds(ctx)
    }
    await next()
  }

  async request(ctx, next) {
    if (!ctx.state.correlation) {
      setCorrelationIds(ctx)
    }
    await next()
  }

  async error(ctx, next) {
    if (!ctx.state.correlation) {
      setCorrelationIds(ctx)
    }
    await next()
  }

  async teardown() { 
    // noop
  }
}


function setCorrelationIds(ctx) {
  let correlation = getCorrelationHeaders(ctx)
  if (!correlation["x-correlation-id"]) {
    correlation["x-correlation-id"] = getAWSRequestId(ctx) || uuidV4()
  }
  ctx.state.correlation = correlation
  ctx.logger.state(correlation)
}

function getCorrelationHeaders(ctx) {
  let headers = { }
  if (!ctx.event || !ctx.event.headers) return headers
  for (let name in ctx.event.headers) {
    if (name.toLowerCase().startsWith("x-correlation-")) {
      headers[name] = ctx.event.headers[name]
    }
  }
  return headers
}

function getAWSRequestId(ctx) {
  return ctx.context && ctx.context.awsRequestId || null
}


module.exports = CorrelationIdsPlugin



