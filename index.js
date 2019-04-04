// Importing Required Packages
const Twit = require('twit');
const config = require('./config');
const log = require('./classes/log');
const discord = require('./Classes/discord');

// Initializing Twit Client
const T = new Twit(config.Twitter.Keys);

var userIds = [];
const init = () => {
  log.green('Initializing Monitor!');
  return new Promise((resolve, reject) => {
    config.Twitter.Accounts.forEach(account => {
      T.get('/users/show', { screen_name: account }, (err, data, res) => {
        if (err) { reject(); return log.red(`ERROR: ${err}`); }
        userIds.push(data.id_str);
        if (userIds.length == config.Twitter.Accounts.length) {
          resolve();
        }
      })
    })
  })
};

const monitor = () => {
  let stream = T.stream('statuses/filter', { follow: ( userIds ) });

  stream.on('connected', res => {
    log.cyan(`Monitor connected to Twitter API. Monitoring ${config.Twitter.Accounts.length} profiles.`);
  });

  stream.on('tweet', tweet => {
    // Looping through all userIds
    if (userIds.includes(tweet.user.id_str)) {
      // Tweet Reply?
      if (!isReply(tweet) == true) {
        log.green('+ NEW TWEET +');
        discord.sendHook(tweet);
      } else {
        log.gray('Bad Tweet');
      }
    }
  }); 
};

init().then(() => {
  monitor();
});

const isReply = tweet => {
  if (tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_status_id_str || tweet.in_reply_to_user_id || tweet.in_reply_to_user_id_str || tweet.in_reply_to_screen_name) {
    return true
  };
};