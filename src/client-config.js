let config={}
if(process.env.ENV === "prod"){
    const PROTO = process.env.PROTO ? process.env.PROTO: 'http://';
    const HOST=  process.env.HOST ? process.env.HOST : 'localhost';
    const PORT = process.env.PORT ? process.env.PORT: '7000';
    config.API_BASE= PROTO+HOST+PORT+'/'
}else{
    config.API_BASE='http://localhost:7000'
}

Object.freeze(config);
module.exports=config;