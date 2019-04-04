// Importing Required Packages
const request = require("request-promise");
const config = require("../config");

module.exports = {
  /**
   * sendPlain
   * Send the found tweet to the discord webhook
   * saved in config.js
   * @param {Object} tweet
   * @returns {Promise} resolves upon completion
   */
  sendHook: tweet => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          username: tweet.user.name,
          avatar_url: tweet.user.profile_image_url_https,
          embeds: [
            {
              color: 0x72c989,
              author: {
                name: tweet.user.name,
                icon_url: tweet.user.profile_image_url_https
              },
              title: "Tweet Link",
              url: `https://twitter.com/${tweet.user.screen_name}/status/${
                tweet.id_str
              }`,
              description: tweet.text,
              thumbnail: {
                url: tweet.user.profile_image_url_https
              },
              image: {
                url: tweet.entities.media
                  ? tweet.entities.media[0].media_url
                  : ""
              },
              footer: {
                text: `Twitter Monitor | ${tweet.user.name}`
              }
            }
          ]
        }
      })
        .then(() => {
          console.log("Sent Hook");
          resolve();
        })
        .catch(console.error);
    });
  }
};
