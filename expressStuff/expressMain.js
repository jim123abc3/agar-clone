// Entrypoint for all express related stuff

const app = require('../servers').app;
const io = require('../servers').io;

module.exports = app;