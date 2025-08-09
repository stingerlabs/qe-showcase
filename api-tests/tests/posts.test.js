const { expect } = require('chai');
// Optional JSON schema validation (uncomment and add to package.json if you want):
// const Ajv = require('ajv'); const ajv = new Ajv({ allErrors: true });

const safeId = 1; // JSONPlaceholder valid range: 1..100

function jsonFrom(args) {
  const buf = args.response?.stream;
  if (!buf) return null;
  try { return JSON.parse(Buffer.from(buf).toString('utf8')); } catch { return null; }
}

function forceIdInUrl(req, id) {
  const urlStr = req.url.toString();
  let newRaw;
  if (/\/posts\/?$/.test(urlStr)) newRaw = urlStr.replace(/\/posts\/?$/, `/posts/${id}`);
  else newRaw = urlStr.replace(/\/posts\/[^/]*$/, `/posts/${id}`);
  req.url.update(newRaw);
}

module.exports = {
  // Make sure PUT/DELETE/PATCH hit /posts/{safeId} and align bodies
  beforeRequest: (args) => {
    const name = args.item?.name || '';
    const req = args.request;

    if (name === 'PUT Update Post' || name === 'DELETE Post' || name === 'PATCH Update Post (title only)') {
      forceIdInUrl(req, safeId);
    }
    if (name === 'PUT Update Post') {
      const payload = { id: safeId, title: 'Updated Test Post', body: 'This is the updated body.', userId: 1 };
      req.body?.update?.({ mode: 'raw', raw: JSON.stringify(payload) });
    }
    if (name === 'PATCH Update Post (title only)') {
      const payload = { title: 'Patched Title' };
      req.body?.update?.({ mode: 'raw', raw: JSON.stringify(payload) });
    }
  },

  onRequest: (args) => {
    const name = args.item?.name || '';
    const res = args.response;
    const status = res?.code;
    const json = jsonFrom(args);

    // Shared sanity: JSON + headers + perf
    const ct = res?.headers?.get?.('content-type') || res?.headers?.member?.('content-type')?.value;
    expect(ct?.toLowerCase() || '', 'content-type includes json').to.include('application/json');
    expect(res.responseTime, 'response time < 1200ms').to.be.below(1200);

    if (name === 'GET All Posts') {
      expect(status, 'GET /posts status').to.equal(200);
      expect(json).to.be.an('array').that.is.not.empty;
      // Type spot-check
      const p = json[0];
      expect(p).to.include.keys(['userId', 'id', 'title', 'body']);
      expect(p.id).to.be.a('number');
      expect(p.userId).to.be.a('number');
      expect(p.title).to.be.a('string');
      expect(p.body).to.be.a('string');

      // Example simple schema (if using Ajv, uncomment below):
      // const schema = { type: 'array', items: { type: 'object', required: ['userId','id','title','body'] } };
      // expect(ajv.validate(schema, json), ajv.errorsText(ajv.errors)).to.equal(true);
    }

    if (name === 'GET Filtered Posts (userId=1)') {
      expect(status, 'GET /posts?userId=1 status').to.equal(200);
      expect(json).to.be.an('array').that.is.not.empty;
      json.forEach(item => expect(item.userId).to.equal(1));
    }

    if (name === 'POST Create Post') {
      expect(status, 'POST /posts status').to.equal(201);
      expect(json).to.be.an('object').that.includes.keys(['id', 'title', 'body', 'userId']);
      expect(json.title).to.be.a('string');
      expect(json.body).to.be.a('string');
      expect(json.userId).to.equal(1);
    }

    if (name === 'PUT Update Post') {
      expect(status, 'PUT /posts/{id} status').to.equal(200);
      expect(json).to.be.an('object');
      expect(json.id).to.equal(safeId);
      expect(json.title).to.equal('Updated Test Post');
      expect(json.body).to.equal('This is the updated body.');
    }

    if (name === 'PATCH Update Post (title only)') {
      expect(status, 'PATCH /posts/{id} status').to.equal(200);
      expect(json).to.be.an('object');
      expect(json.title).to.equal('Patched Title');
    }

    if (name === 'DELETE Post') {
      expect(status, 'DELETE /posts/{id} status').to.equal(200);
      // often {}
      expect(json === null || typeof json === 'object').to.be.true;
    }
  }
};
