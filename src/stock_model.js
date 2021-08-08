const {DateTime} = require('luxon');
const Tradier = require('tradier-api')
const credentials = require('../credentials.secret.json');

class Stock_Model {
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
    async options_lookup(expiration_date, call_put = "call"){
        const chain_raw = await this.tradier.getOptionChains(this.symbol,expiration_date);
        return chain_raw.option.filter(option=>option.option_type == call_put);
    }
}
module.exports = Stock_Model;
// var test = new Stock_Model();
// test.options_lookup("2021-08-18").then(quote=>{
//     console.log(quote);
//     // console.log(quote["3"][0].toFormat("DD"));
//     // quote.forEach(q=>console.log(q[0].toFormat("DD")))
//     // console.log(quote[0][0].toFormat("DD"));
// }).catch(error=>{
//     console.error(error);
// })