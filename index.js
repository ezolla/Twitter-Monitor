// Importing Required Packages
const Twit = require("twit");
// Local Imports
const config = require("./config");
const log = require("./classes/log");
const discord = require("./Classes/discord");
const ocr = require("./Classes/ocr");

// Initializing Twit Client
const T = new Twit(config.Twitter.Keys);

let userIds = [];
const init = () => {
  log.green("Initializing Monitor!");
  return new Promise((resolve, reject) => {
    config.Twitter.Accounts.forEach(account => {
      T.get("/users/show", { screen_name: account }, (err, data, res) => {
        if (err) {
          reject(err);
          return log.red(`ERROR: ${err}`);
        }
        userIds.push(data.id_str);
        if (userIds.length === config.Twitter.Accounts.length) {
          resolve();
        }
      });
    });
  });
};

const monitor = () => {
  // Initializing Twitter Stream
  let stream = T.stream("statuses/filter", { follow: userIds });

  // Stream Connect Event
  stream.on("connect", request => {
    log.cyan("Attempting to Connect to Twitter API");
  });

  // Stream Connected Event
  stream.on("connected", res => {
    log.cyan(
      `Monitor Connected to Twitter API. Monitoring ${
        config.Twitter.Accounts.length
      } profiles.`
    );
  });

  // Stream Tweet Event
  stream.on("tweet", tweet => {
    // Looping through all userIds
    if (userIds.includes(tweet.user.id_str)) {
      // Tweet Reply?
      if (!isReply(tweet) === true) {
        log.green("New Tweet");
        discord.sendHook(tweet);

        // Checking for Image - OCR
        if (tweet.entities.media) {
          ocr.getImageText(tweet, tweet.entities.media[0].media_url);
        }
      } else {
        log.red("Bad Tweet");
      }
    }
  });

  // Stream Warning Event
  stream.on("warning", warning => {
    log.yellow(`Monitor Received Warning from Twitter API 
    Warning Message: ${warning}`);
  });

  // Stream Disconnect Event
  stream.on("disconnect", disconnectMessage => {
    log.red(`Monitor Disconnected from Twitter API Stream 
    Error Message: ${disconnectMessage}`);
  });
};

init().then(monitor);

const isReply = tweet => {
  return (
    tweet.retweeted_status ||
    tweet.in_reply_to_status_id ||
    tweet.in_reply_to_status_id_str ||
    tweet.in_reply_to_user_id ||
    tweet.in_reply_to_user_id_str ||
    tweet.in_reply_to_screen_name
  );
};
