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
    describe(`happy path`, ()=>{

    })

    describe(`negative path`, ()=>{

    })
})


