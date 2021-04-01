const axios = require('axios')
const FAUCETSECRET = process.env.FAUCETSECRET;
let wazSent = {};
let sendAlways = false

async function callFaucet(arg, userString) {
	console.log(userString)
  return axios.post(`http://localhost:3001/gimmie`, {
    address: arg,
    user: userString
  }).then(res => {
    console.log(`statusCode:`, res.data)
    if (res.data.result === true) {
      // console.log(res.data.success)
      wazSent[arg] === undefined ? wazSent[arg] = 1 : wazSent[arg] += 1
      return `transaction confirmed! sent to ${arg} 🐝`
    } else {
      // console.log(res.data.error)
      return "Something went terribly wrong."
    }
  }).catch((error) => {
    console.error('error!', error)
    if(error.response.data.error){
	    return `${error.response.data.error}`
    }else{
	    return `Faucet calling error ${error}`
    }
  })
}

module.exports = {
  name: 'sprinkle',
  description: 'Sprinkle',
  execute(msg, args) {
	let userString = `${msg.author.username}-${msg.author.discriminator}`
    if (msg.channel.name != "faucet-request-test") {
      msg.reply(`I'm sorry I can only Sprinkle in #faucet-request...`)
    } else {
      msg.reply('hold on... checking out ' + msg.author.username + ' spam status');
      if (wazSent[args[0]] !== undefined && (wazSent[args[0]] > 0 && sendAlways !== true)) {
        msg.reply('You sprinkled this address already ' + msg.author.username + ' you naughty you!');
      } else {
      	msg.reply('sending gBZZ and gETH to ' + args[0]);
        callFaucet(args[0], userString).then((result) => {
          msg.reply(result);
        }).catch((error) => {
          console.log('e',error)
          msg.reply(error.message);
        })
      }
    }
  },
};

