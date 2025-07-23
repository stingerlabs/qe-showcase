import agent from 'superagent'

//Target Host
const host = `https://jsonplaceholder.typicode.com/`

//Generate new payloads, if more tests used this we would move to a common directory
function* dataGenerator(): Generator<{ id?:string; title: string; body: string; userId: number; }> {
    let idCounter = 1; 
    while (true) {
        yield {
        title: `Generated Title ${idCounter}`, // Placeholder title
        body: `This is the body content for item number ${idCounter}.`, // Placeholder body
        userId: 1,
        };
        idCounter++;
    }
}

//asserting common headers, if more tests used this we would move to a common directory
function assertCommonHeaders(headers:{[k:string]:any}, useCors?:boolean) {
    expect(headers['content-type'].includes('application/json')).toBe(true)
    expect(headers['access-control-allow-credentials']).toBe('true')
    // misconfigured cors policy that reflects any origin is insecure corss-origin resource sharing
    if(useCors) expect(headers['access-control-allow-origin']).not.toBe('http://example.com'); 
    expect(headers['x-powered-by']).toBeUndefined() //this information can help an attacker find known vulnerabilities of the system
}


describe(`Test POSTS`,()=>{
    const generatePost = dataGenerator()
    describe(`happy path`, ()=>{
        //We get our initial payload set
        const initialPayloadValue = generatePost.next().value
        let createdPostId: number // to store id back from api

        it(`can create a post`,async ()=>{
            const payload = initialPayloadValue
            const {status, body, headers} = await agent.post(`${host}/posts`)
                .ok((res)=>res.status< 502)
                .set('Origin', 'http://example.com')
                .send(payload)
            expect(status).toBe(201) //https://www.rfc-editor.org/rfc/rfc9110.html#name-201-created
            expect(body.id).toBeDefined()
            createdPostId = body.id //store id for further use, we want to store this even if rest of asserts fail
            expect(body.body).toBe(payload.body)
            expect(body.title).toBe(payload.title)
            expect(body.userId).toBe(payload.userId)
            assertCommonHeaders(headers,true)
        })

        it(`can get a post by id`,async ()=>{
            const payload = initialPayloadValue
            const {status, body, headers} = await agent.get(`${host}/posts/${createdPostId}`)
                .ok((res)=>res.status< 502)
                .set('Origin', 'http://example.com')
            console.log(`${createdPostId}, ${JSON.stringify(body)} ${status}`)
            expect(status).toBe(200) //https://www.rfc-editor.org/rfc/rfc9110.html#name-200-ok
            expect(body.id).toBe(createdPostId)
            expect(body.body).toBe(payload.body)
            expect(body.title).toBe(payload.title)
            expect(body.userId).toBe(payload.userId)
            assertCommonHeaders(headers,true)
        })
        it(`can update a post with put by id`,async ()=>{
            const payload = initialPayloadValue
            payload.title = 'New Updated Title'
            const {status, body, headers} = await agent.put(`${host}/posts/${createdPostId}`)
                .ok((res)=>res.status< 502)
                .send(payload)
                .set('Origin', 'http://example.com')
            expect(status).toBe(200) //https://www.rfc-editor.org/rfc/rfc9110.html#name-200-ok
            expect(body.id).toBe(createdPostId)
            expect(body.body).toBe(payload.body)
            expect(body.title).toBe(payload.title)
            expect(body.userId).toBe(payload.userId)
            assertCommonHeaders(headers,true)
        })

        it(`can delete a post with by id`,async ()=>{
            const {status, body, headers} = await agent.delete(`${host}/posts/${createdPostId}`)
                .ok((res)=>res.status< 502)
                .set('Origin', 'http://example.com')
            expect(body).toEqual({})
            expect(status).toBe(204) // delete request has no body therefore: 204 https://www.rfc-editor.org/rfc/rfc9110.html#name-204-no-content
            assertCommonHeaders(headers,true)
        })
    })

    describe(`negative path`, ()=>{

    })
})


