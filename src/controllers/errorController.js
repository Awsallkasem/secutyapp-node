const shared = require('../../src/shared/index');

module.exports = function error(socket, msg) {

   
   return socket.emit('err', { message: msg });
 



}