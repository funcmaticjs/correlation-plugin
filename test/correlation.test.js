const CorrelationIdsPlugin = require('../lib/correlation')
const { ConsoleLogger } = require('@funcmaticjs/funcmatic')

describe('Essentials', () => {
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
      logger: new ConsoleLogger()
    }
    plugin = new CorrelationIdsPlugin()
  })
  it ('should set a new correlationId if not present in headers', async () => {
    ctx.context.awsRequestId = 'AWS-REQUEST-ID'
    await plugin.request(ctx, noop)
    expect(ctx.logger.meta()).toMatchObject({
      'x-correlation-id': 'AWS-REQUEST-ID',
    })
    ctx.logger.info("should include 'x-correlation-id' field")
  })
  it ('should use an existing correlationId if present in headers', async () => {
    ctx.event.headers['x-correlation-id'] = 'AWS-REQUEST-ID'
    await plugin.request(ctx, noop)
    expect(ctx.logger.meta()).toMatchObject({
      'x-correlation-id': 'AWS-REQUEST-ID'
    })
  })
  it ('should allow multiple correlation headers', async () => {
    ctx.event.headers['x-correlation-id'] = 'AWS-REQUEST-ID'
    ctx.event.headers['x-correlation-other'] = 'RELEVANT-CORRELATION-CONTEXT'
    await plugin.request(ctx, noop)
    expect(ctx.logger.meta()).toMatchObject({
      'x-correlation-id': 'AWS-REQUEST-ID',
      'x-correlation-other': 'RELEVANT-CORRELATION-CONTEXT'
    })
    ctx.logger.info("should inclue 'x-correlation-id' and 'x-correlation-other' fields")
  })
})