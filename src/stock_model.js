const {DateTime} = require('luxon');
const Tradier = require('tradier-api');
const Option = require('./option.js');
const CoveredCall = require('./covered_call.js');
const credentials = require('../credentials.secret.json');



class StockModel {
    constructor(symbol="QQQ"){
        this.symbol = symbol;
        this.tradier = new Tradier(credentials.api_key, "sandbox");
    }
    async stock_lookup(){
        return this.tradier.getQuote(this.symbol);
    }
    async expirations_dates(limit = 5){
        const now = DateTime.now();
        const dates_raw = await this.tradier.getOptionExpirations(this.symbol);
        var dates = {};
        dates_raw.date.forEach(date_raw => {
            const date = DateTime.fromISO(date_raw);
            if(dates[date.weekNumber]){
                dates[date.weekNumber].push(date);
            } else {
                dates[date.weekNumber] = [date];
            } 
        });
        return Object.values(dates).sort((a,b)=>{
            if(a>b){
                return 1;
            } else if(a < b){
                return -1;
            } else {
                return 0;
            }
        }).slice(0,limit);
    }
    async options_lookup(expiration_date, market_price, call_put = "call"){
        const chain_raw = await this.tradier.getOptionChains(this.symbol,expiration_date);
        const calls = chain_raw.option.filter(option=>option.option_type == call_put);
        const relevant_prices = calls.filter(option=>option.strike<(market_price+10));
        const cast = relevant_prices.map(option=>new CoveredCall(option, market_price));
        return cast.reverse();
    }
}


module.exports = StockModel;
// var test = new StockModel();
// test.options_lookup("2021-08-18", 368.96).then(quote=>{
//     console.log(quote);
//     // console.log(quote["3"][0].toFormat("DD"));
//     // quote.forEach(q=>console.log(q[0].toFormat("DD")))
//     // console.log(quote[0][0].toFormat("DD"));
// }).catch(error=>{
//     console.error(error);
// });