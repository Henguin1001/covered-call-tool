const Option = require('./option.js');

class CoveredCall extends Option {
    constructor(option_object, market_price){
        super(option_object);
        this.market_price = market_price;
        try {
            this.break_even = market_price - this.mark;
            console.log(this.mark);
            this.assignment_gain = 100*(this.strike+this.mark-market_price);
            this.assignment_gain_percent = this.assignment_gain/market_price;
            const tte = this.time_to_expiration();
            this.time = 24*tte.days + tte.hours;
            this.risk = this.time/this.mark;
            this.time_gain = 24*this.assignment_gain/this.time;
            this.time_gain_percent = 24*this.assignment_gain_percent/this.time;
            console.log(this.assignment_gain);
        } catch (error) {
            console.error("Field Doesn't exist\n", error);
        }
    }

}
module.exports = CoveredCall;
// var option = new CoveredCall({
//     "symbol": "VXX190517P00016000",
//     "description": "VXX May 17 2019 $16.00 Put",
//     "exch": "Z",
//     "type": "option",
//     "last": null,
//     "change": null,
//     "volume": 0,
//     "open": null,
//     "high": null,
//     "low": null,
//     "close": null,
//     "bid": 7.1,
//     "ask": 7.1,
//     "underlying": "VXX",
//     "strike": 360.0,
//     "change_percentage": null,
//     "average_volume": 0,
//     "last_volume": 0,
//     "trade_date": 0,
//     "prevclose": null,
//     "week_52_high": 0.0,
//     "week_52_low": 0.0,
//     "bidsize": 0,
//     "bidexch": "J",
//     "bid_date": 1557171657000,
//     "asksize": 611,
//     "askexch": "Z",
//     "ask_date": 1557172096000,
//     "open_interest": 10,
//     "contract_size": 100,
//     "expiration_date": "2021-08-18",
//     "expiration_type": "standard",
//     "option_type": "put",
//     "root_symbol": "VXX",
//     "greeks": {
//         "delta": 1.0,
//         "gamma": 1.95546E-10,
//         "theta": -0.00204837,
//         "vega": 3.54672E-9,
//         "rho": 0.106077,
//         "phi": -0.28801,
//         "bid_iv": 0.0,
//         "mid_iv": 0.0,
//         "ask_iv": 0.0,
//         "smv_vol": 0.380002,
//         "updated_at": "2019-08-29 14:59:08"
//     }
// }, 366.8);
// console.log(option);