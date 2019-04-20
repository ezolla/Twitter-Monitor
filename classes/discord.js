// Importing Required Packages
const request = require("request-promise");
// Local Imports
const config = require("../config");
const log = require("./log");

module.exports = {
  /**
   * Send Hook
   * Sends new tweet content when a new
   * tweet is found
   * @param {Object} tweet
   * @returns {Promise} resolves upon completion
   */
  sendHook: tweet => {
    const fields = [];

    // Checking if tweet contains a link
    if (tweet.entities.urls[0]) {
      log.gray("Link Identified");
      fields.push({
        name: "Link",
        value: tweet.entities.urls[0].expanded_url,
        inline: true
      });
    }

    // Checking if tweet mentions anyone
    if (tweet.entities.user_mentions[0]) {
      log.gray("User Mention Identified");
      fields.push({
        name: "User Mentions",
        value: tweet.entities.user_mentions
          .map(user => `@${user.screen_name} - ${user.name}`)
          .join(", "),
        inline: true
      });
    }

    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          username: tweet.user.name,
          avatar_url: tweet.user.profile_image_url_https,
          embeds: [
            {
              color: 0x45c577,
              author: {
                name: tweet.user.name,
                icon_url: tweet.user.profile_image_url_https
              },
              title: "Tweet Link",
              url: `https://twitter.com/${tweet.user.screen_name}/status/${
                tweet.id_str
              }`,
              description: tweet.text,
              image: {
                url: tweet.entities.media
                  ? tweet.entities.media[0].media_url
                  : ""
              },
              fields: fields,
              footer: {
                text: `Twitter Monitor | ${tweet.user.name} | @exhwn`,
                icon_url:
                  "https://cdn.freebiesupply.com/logos/large/2x/twitter-3-logo-png-transparent.png"
              }
            }
          ]
        }
      })
        .then(() => {
          log.gray("Sent Hook");
          resolve();
        })
        .catch(console.error);
    });
  },

  /**
   * Send OCR
   * Sends ocr image recognition results to
   * discord when tweet contains an image
   * @param {Object} tweet
   * @param {String} text
   * @returns {Promise} resolves upon completion
   */
  sendOcr: (tweet, text) => {
    return new Promise((resolve, reject) => {
      request({
        url: config.Discord.webhook,
        method: "POST",
        json: {
          username: tweet.user.name,
          avatar_url: tweet.user.profile_image_url_https,
          embeds: [
            {
              color: 0x45c577,
              title: "OCR Result",
              description: text,
              footer: {
                text: `Twitter Monitor | ${tweet.user.name} | @exhwn`,
                icon_url:
                  "https://cdn.freebiesupply.com/logos/large/2x/twitter-3-logo-png-transparent.png"
              }
            }
          ]
        }
      })
        .then(() => {
          log.gray("Sent OCR Results");
          resolve();
        })
        .catch(console.error);
    });
  }
};
