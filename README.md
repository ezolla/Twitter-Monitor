![Twitter x Discord](https://i.gyazo.com/791be5a183d315788587f0a280bc99fe.png)

# Twitter Monitor

Monitor your favorite twitter accounts easily, with discord webhook integration!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need to have [nodejs](https://nodejs.org/en/) installed in order to run. You will also need npm but this is installed with nodejs.

### Installing

First you will clone or download this repository, then open your favorite text editor, mine is [vscode](https://code.visualstudio.com/). Then open up the console and do the following command.

```
npm install
```

Now you will need to add your twitter api keys that you can get [here](https://developer.twitter.com/content/developer-twitter/en.html) by filling out the twitter developer application. You will also need to get the webhook url for the discord channel you desire, you can find directions to do that [here](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks)!

## Running the tests

Try running it now with this simple command inside the console.

```
npm start
```

## Deployment

If you would like to run this 24/7 off your personal machine I would reccomend using the free credit given with google cloud, and create a server. You can make sure it runs all the time with a npm package named PM2 which will restart if errors or crashes happen.

## Built With

* [Nodejs](https://nodejs.org/en/) - Javascript Runtime Environment
* [NPM](https://www.npmjs.com/) - Node Package Manager
* [Twitter API](https://developer.twitter.com/en/docs) - Twitter's API
* [Twit](https://www.npmjs.com/package/twit) - Twitter API Wrapper
* [Request-Promise](https://www.npmjs.com/package/request-promise) - Request Library

## Authors

* **Ethan Zoller** - [Site](https://www.ethanzoller.com/) | [Twitter](https://twitter.com/Ethanzolla)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
