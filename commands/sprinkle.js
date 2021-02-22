const axios = require('axios')
const FAUCETSECRET = process.env.FAUCETSECRET;
let wazSent = {};
let sendAlways = false

async function callFaucet(arg) {
  return axios.post('https://faucet.ethswarm.org/fund-gbzz', {
    token: FAUCETSECRET,
    receiver: arg
  }).then(res => {
    console.log(`statusCode:`, res.data)
    if (res.data.success) {
      console.log(res.data.success)
      wazSent[arg] === undefined ? wazSent[arg] = 1 : wazSent[arg] += 1
      return res.data.success.faucetAddress
    } else {
      console.log(res.data.error)
      return "Something went terribly wrong."
    }
  }).catch(error => {
    console.error('error!', error)
    return "Faucet calling error"
  })
}

module.exports = {
  name: 'sprinkle',
  description: 'Sprinkle',
  execute(msg, args) {
    msg.reply('hold on... checking out ' + msg.author.username + ' spam status');
    if (wazSent[args[0]] !== undefined && (wazSent[args[0]] > 0 && sendAlways !== true)) {
      msg.channel.send('You sprinkled this address already ' + msg.author.username + ' you naughty you!');
    } else {
      callFaucet(args[0]).then((result) => {
        msg.channel.send(result);
      })
    }
  },
};

