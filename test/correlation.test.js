const CorrelationIdsPlugin = require('../lib/correlation')
const { LoggerWrapper } = require('@funcmaticjs/funcmatic')

describe('Correlation', () => {
  let ctx = { }
  let plugin = null
  let noop = () => { }
  beforeEach(() => {
    ctx = {
      event: {
        headers: { }
      },
      context: { },
      state: { },
      logger: new LoggerWrapper()
    }
    plugin = new CorrelationIdsPlugin()
  })
  it ('should set a new correlationId if not present in headers', async () => {
    ctx.context.awsRequestId = 'AWS-REQUEST-ID'
    await plugin.request(ctx, noop)
    expect(ctx.logger.state()).toMatchObject({
      'X-Correlation-Id': 'AWS-REQUEST-ID',
    })
    ctx.logger.info("should include 'X-Correlation-Id' field")
  })
  it ('should use an existing correlationId if present in headers', async () => {
    ctx.event.headers['X-Correlation-Id'] = 'AWS-REQUEST-ID'
    await plugin.request(ctx, noop)
    expect(ctx.logger.state()).toMatchObject({
      'X-Correlation-Id': 'AWS-REQUEST-ID'
    })
  })
  it ('should allow multiple correlation headers', async () => {
    ctx.event.headers['X-Correlation-Id'] = 'AWS-REQUEST-ID'
    ctx.event.headers['X-Correlation-Other'] = 'RELEVANT-CORRELATION-CONTEXT'
    await plugin.request(ctx, noop)
    expect(ctx.logger.state()).toMatchObject({
      'X-Correlation-Id': 'AWS-REQUEST-ID',
      'X-Correlation-Other': 'RELEVANT-CORRELATION-CONTEXT'
    })
  })
})