
const got = require('got')
const tunnel = require('tunnel');
const {
    CookieJar
} = require('tough-cookie');
const Discord = require("discord.js");
const intents = new Discord.Intents(32767);
const client = new Discord.Client({
    intents
});
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Formatters
} = require('discord.js');
const url = 'https://stockx.com/api/browse?&_search=';
const serverId ="Fill in your server ID";
client.once("ready", () => {
    console.log(`${client.user.username} is online`);
    client.user.setActivity("Made by Yao Chen", {
        type: "PLAYING"
    });
});

var retailPrice;
var title;
var image;
var highestBid;
var highestBidSize;
var lowestAsk;
var lowestAskSize;
var releaseDate;
var styleId;
var urlkey;
var catgory;
var descirption;
client.on("messageCreate", async message => {
    /*
    if (message.content.startsWith('!checkmemberIDs')) {
        var temp = ['0'];
        const server = client.guilds.cache.get(`${serverId}`)
        var log = message.content.slice(15).trim().split(' ')
        server.members.cache.each(member => {
            temp.push(member.user.id)
          });
        console.log(temp.length)
        message.reply("These IDs are not members")
        for(var i = 0 ; i < log.length;i++){      
            if(temp.includes(log[i]) == false){
                message.channel.send(log[i])
            }      
        }
    }
    */
    if (message.content.startsWith("!sku")) {
        //let Proxies = fs.readFileSync('proxies.txt', 'utf8').toString().split(':');
        //let len = Proxies.length;
        const args = message.content.slice(4).trim().split(' ');
        let kw = "";
        for (var i = 0; i < args.length; i++) {
            kw += args[i];
        }
        //using proxy to prevent rate limited
        const host = 'Your IP'
        const port = 'Port'
        const userPass = 'account:password'
        res = await got.get(url + args + '&dataType=product', {
            responseType: 'json',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,ja;q=0.5",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
            },
            agent: {
                http: tunnel.httpOverHttp({
                    proxy: {
                        host: `${host}`,
                        port: `${port}`,
                        proxyAuth: `${userPass}`
                    }
                })
            }
        })

        if (res.body.Products == "") {
            message.channel.send("Not Found")
        } else {
            retailPrice = res.body.Products[0].retailPrice
            title = res.body.Products[0].title
            image = res.body.Products[0].media.imageUrl
            highestBid = res.body.Products[0].market.highestBid.toString()
            highestBidSize = res.body.Products[0].market.highestBidSize.toString()
            lowestAsk = res.body.Products[0].market.lowestAsk.toString()
            lowestAskSize = res.body.Products[0].market.lowestAskSize.toString()
            releaseDate = res.body.Products[0].releaseDate.toString()
            styleId = res.body.Products[0].styleId.toString()
            urlkey = res.body.Products[0].urlKey
            catgory = res.body.Products[0].productCategory.toString()
            descirption = res.body.Products[0].shortDescription.toString()
        }
    
        response = got.post('https://stockx.com/p/e', {
            responseType: 'json',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,ja;q=0.5",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "apollographql-client-name": "Iron"
            },
            body: JSON.stringify({
                "operationName": "GetProduct",
                "variables": {
                    "id": `${urlkey}`,
                    "currencyCode": "USD",
                    "countryCode": "TW"
                },
                "query": "query GetProduct($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String) {\n  product(id: $id) {\n    id\n    ...AffirmCalloutFragment\n    ...BidButtonContentFragment\n    ...BreadcrumbsFragment\n    ...BreadcrumbSchemaFragment\n    ...BuySellContentFragment\n    ...BuySellFragment\n    ...HazmatWarningFragment\n    ...HeaderFragment\n    ...LastSaleFragment\n    ...LowInventoryBannerFragment\n    ...MarketActivityFragment\n    ...MediaFragment\n    ...ProductMetaTagsFragment\n    ...ProductSchemaFragment\n    ...ScreenTrackerFragment\n    ...SizeSelectorWrapperFragment\n    ...StatsForNerdsFragment\n    ...ThreeSixtyImageFragment\n    ...TrackingFragment\n    ...UtilityGroupFragment\n    ...ProductDetailsFragment\n    ...MyPositionFragment\n    __typename\n  }\n}\n\nfragment AffirmCalloutFragment on Product {\n  productCategory\n  urlKey\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n      __typename\n    }\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment BidButtonContentFragment on Product {\n  id\n  urlKey\n  sizeDescriptor\n  productCategory\n  lockBuying\n  lockSelling\n  minimumBid(currencyCode: $currencyCode)\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      highestBidSize\n      lowestAsk\n      lowestAskSize\n      __typename\n    }\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        highestBidSize\n        lowestAsk\n        lowestAskSize\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment BreadcrumbsFragment on Product {\n  breadcrumbs {\n    name\n    url\n    level\n    __typename\n  }\n  __typename\n}\n\nfragment BreadcrumbSchemaFragment on Product {\n  breadcrumbs {\n    name\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment BuySellContentFragment on Product {\n  id\n  urlKey\n  sizeDescriptor\n  productCategory\n  lockBuying\n  lockSelling\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      highestBidSize\n      lowestAsk\n      lowestAskSize\n      __typename\n    }\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        highestBidSize\n        lowestAsk\n        lowestAskSize\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment BuySellFragment on Product {\n  id\n  title\n  urlKey\n  sizeDescriptor\n  productCategory\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      highestBidSize\n      lowestAsk\n      lowestAskSize\n      __typename\n    }\n    __typename\n  }\n  media {\n    imageUrl\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        highestBidSize\n        lowestAsk\n        lowestAskSize\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HazmatWarningFragment on Product {\n  id\n  hazardousMaterial {\n    lithiumIonBucket\n    __typename\n  }\n  __typename\n}\n\nfragment HeaderFragment on Product {\n  primaryTitle\n  secondaryTitle\n  condition\n  productCategory\n  __typename\n}\n\nfragment LastSaleFragment on Product {\n  id\n  market(currencyCode: $currencyCode) {\n    ...LastSaleMarket\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      ...LastSaleMarket\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment LastSaleMarket on Market {\n  salesInformation {\n    annualHigh\n    annualLow\n    volatility\n    pricePremium\n    lastSale\n    changeValue\n    changePercentage\n    __typename\n  }\n  __typename\n}\n\nfragment LowInventoryBannerFragment on Product {\n  id\n  productCategory\n  primaryCategory\n  sizeDescriptor\n  market(currencyCode: $currencyCode) {\n    ...LowInventoryBannerMarket\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      ...LowInventoryBannerMarket\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment LowInventoryBannerMarket on Market {\n  bidAskData(country: $countryCode, market: $marketName) {\n    numberOfAsks\n    lowestAsk\n    __typename\n  }\n  salesInformation {\n    lastSale\n    __typename\n  }\n  __typename\n}\n\nfragment MarketActivityFragment on Product {\n  id\n  title\n  productCategory\n  primaryTitle\n  secondaryTitle\n  media {\n    smallImageUrl\n    __typename\n  }\n  __typename\n}\n\nfragment MediaFragment on Product {\n  id\n  productCategory\n  title\n  brand\n  urlKey\n  variants {\n    id\n    hidden\n    traits {\n      size\n      __typename\n    }\n    __typename\n  }\n  media {\n    gallery\n    all360Images\n    imageUrl\n    __typename\n  }\n  __typename\n}\n\nfragment ProductMetaTagsFragment on Product {\n  id\n  urlKey\n  productCategory\n  brand\n  model\n  title\n  description\n  condition\n  styleId\n  breadcrumbs {\n    name\n    url\n    __typename\n  }\n  traits {\n    name\n    value\n    __typename\n  }\n  media {\n    thumbUrl\n    imageUrl\n    __typename\n  }\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n      numberOfAsks\n      __typename\n    }\n    __typename\n  }\n  variants {\n    id\n    hidden\n    traits {\n      size\n      __typename\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ProductSchemaFragment on Product {\n  id\n  urlKey\n  productCategory\n  brand\n  model\n  title\n  description\n  condition\n  styleId\n  traits {\n    name\n    value\n    __typename\n  }\n  media {\n    thumbUrl\n    imageUrl\n    __typename\n  }\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n      numberOfAsks\n      __typename\n    }\n    __typename\n  }\n  variants {\n    id\n    hidden\n    traits {\n      size\n      __typename\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ScreenTrackerFragment on Product {\n  id\n  brand\n  productCategory\n  primaryCategory\n  title\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      lowestAsk\n      numberOfAsks\n      numberOfBids\n      __typename\n    }\n    salesInformation {\n      lastSale\n      __typename\n    }\n    __typename\n  }\n  media {\n    imageUrl\n    __typename\n  }\n  traits {\n    name\n    value\n    __typename\n  }\n  variants {\n    id\n    traits {\n      size\n      __typename\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        lowestAsk\n        numberOfAsks\n        numberOfBids\n        __typename\n      }\n      salesInformation {\n        lastSale\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SizeSelectorWrapperFragment on Product {\n  id\n  ...SizeSelectorFragment\n  ...SizeSelectorHeaderFragment\n  ...SizesFragment\n  ...SizesOptionsFragment\n  ...SizeChartFragment\n  ...SizeChartContentFragment\n  ...SizeConversionFragment\n  ...SizesAllButtonFragment\n  __typename\n}\n\nfragment SizeSelectorFragment on Product {\n  id\n  title\n  productCategory\n  sizeDescriptor\n  availableSizeConversions {\n    name\n    type\n    __typename\n  }\n  defaultSizeConversion {\n    name\n    type\n    __typename\n  }\n  variants {\n    id\n    hidden\n    traits {\n      size\n      __typename\n    }\n    sizeChart {\n      baseSize\n      baseType\n      displayOptions {\n        size\n        type\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SizeSelectorHeaderFragment on Product {\n  sizeDescriptor\n  productCategory\n  availableSizeConversions {\n    name\n    type\n    __typename\n  }\n  __typename\n}\n\nfragment SizesFragment on Product {\n  id\n  productCategory\n  title\n  __typename\n}\n\nfragment SizesOptionsFragment on Product {\n  id\n  variants {\n    id\n    hidden\n    group {\n      shortCode\n      __typename\n    }\n    traits {\n      size\n      __typename\n    }\n    sizeChart {\n      baseSize\n      baseType\n      displayOptions {\n        size\n        type\n        __typename\n      }\n      __typename\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SizeChartFragment on Product {\n  availableSizeConversions {\n    name\n    type\n    __typename\n  }\n  defaultSizeConversion {\n    name\n    type\n    __typename\n  }\n  __typename\n}\n\nfragment SizeChartContentFragment on Product {\n  availableSizeConversions {\n    name\n    type\n    __typename\n  }\n  defaultSizeConversion {\n    name\n    type\n    __typename\n  }\n  variants {\n    id\n    sizeChart {\n      baseSize\n      baseType\n      displayOptions {\n        size\n        type\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SizeConversionFragment on Product {\n  productCategory\n  sizeDescriptor\n  availableSizeConversions {\n    name\n    type\n    __typename\n  }\n  defaultSizeConversion {\n    name\n    type\n    __typename\n  }\n  __typename\n}\n\nfragment SizesAllButtonFragment on Product {\n  id\n  sizeAllDescriptor\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment StatsForNerdsFragment on Product {\n  id\n  title\n  productCategory\n  sizeDescriptor\n  urlKey\n  __typename\n}\n\nfragment ThreeSixtyImageFragment on Product {\n  id\n  title\n  variants {\n    id\n    __typename\n  }\n  productCategory\n  media {\n    all360Images\n    __typename\n  }\n  has360Images\n  __typename\n}\n\nfragment TrackingFragment on Product {\n  id\n  productCategory\n  primaryCategory\n  brand\n  title\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      lowestAsk\n      __typename\n    }\n    __typename\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        lowestAsk\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment UtilityGroupFragment on Product {\n  id\n  ...FollowFragment\n  ...FollowContentFragment\n  ...FollowShareContentFragment\n  ...PortfolioFragment\n  ...PortfolioContentFragment\n  ...ShareFragment\n  __typename\n}\n\nfragment FollowFragment on Product {\n  id\n  productCategory\n  title\n  variants {\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment FollowContentFragment on Product {\n  title\n  __typename\n}\n\nfragment FollowShareContentFragment on Product {\n  id\n  title\n  productCategory\n  sizeDescriptor\n  variants {\n    id\n    traits {\n      size\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PortfolioFragment on Product {\n  id\n  title\n  productCategory\n  variants {\n    id\n    __typename\n  }\n  traits {\n    name\n    value\n    __typename\n  }\n  __typename\n}\n\nfragment PortfolioContentFragment on Product {\n  id\n  productCategory\n  variants {\n    id\n    traits {\n      size\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ShareFragment on Product {\n  id\n  productCategory\n  title\n  media {\n    imageUrl\n    __typename\n  }\n  __typename\n}\n\nfragment MyPositionFragment on Product {\n  id\n  urlKey\n  __typename\n}\n\nfragment ProductDetailsFragment on Product {\n  description\n  traits {\n    name\n    value\n    visible\n    format\n    __typename\n  }\n  __typename\n}\n"
            }),
            agent: {
                http: tunnel.httpOverHttp({
                    proxy: {
                        host: `${host}`,
                        port: `${port}`,
                        proxyAuth: `${userPass}`
                    }
                })
            }
        }).then(res => {
            var sizeinfo = [];
            for (var i = 0; i < res.body.data.product.variants.length; i++) {
                if (res.body.data.product.variants[i].market == null) {
                    continue;
                } else {
                    sizeinfo.push({
                        size: res.body.data.product.variants[i].market.bidAskData.lowestAskSize,
                        price: res.body.data.product.variants[i].market.bidAskData.highestBid
                    })
                }
            }
            sizeinfo.sort(function (a, b) {
                return a.size - b.size;
            });
            sizeinfo.forEach(element => {
                element.size = "US" + element.size + " ";
                element.price = element.price + " USD";
            });
            if (releaseDate == "") {
                releaseDate = "Not Found";
            }
            if (catgory == 'collectibles') {
                const exampleEmbed2 = new MessageEmbed()
                    .setTitle(title)
                    .setURL("https://stockx.com/" + descirption)
                    .setColor('#7557c8')
                    .addField("Retail Price", "$" + retailPrice + " USD")
                    .addField("Highest Bid", `$${highestBid} USD`, true)
                    .addField("Lowest Ask", `$${lowestAsk} USD`, true)
                    .addField("Release Date", ` ${releaseDate}`)
                    .setThumbnail(image)
                    .setTimestamp()
                    .setFooter('');
                message.channel.send({
                    embeds: [exampleEmbed2]
                })
            } else {
                const exampleEmbed = new MessageEmbed()
                    .setTitle(title)
                    .setURL("https://stockx.com/" + descirption)
                    .setColor('#7557c8')
                    .addField("Retail Price", "$" + retailPrice + " USD")
                    .addField("Release Date", ` ${releaseDate}`)
                    .addField("Size", '```' + sizeinfo.map(x => x.size).join("\n") + '```', true)
                    .addField("Lowest Ask", '```' + sizeinfo.map(u => u.price + "|(" + ((parseInt(u.price) - retailPrice) / retailPrice * 100).toFixed(0) + "%)").join("\n") + '```', true)
                    .setThumbnail(image)
                    .setTimestamp()
                    .setFooter('');
                message.channel.send({
                    embeds: [exampleEmbed]
                })
            }
        })
    }
})
client.login('');
