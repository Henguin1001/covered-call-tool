const {DateTime} = require('luxon');

const NYSE_ZONE = 'America/New_York';
const NYSE_CLOSE = {
    hour: 16 // 4 pm EST
}

class Option { 
    constructor(option_object){
        // inherit all the properties of input object
        Object.assign(this,option_object);
        this.mark = (this.bid+this.ask)/2;
        // Save original ISO date
        this.expiration_date_iso = this.expiration_date;
        // Cast ISO date to Luxon date with the time being 4 pm EST (Options Market Close)
        this.expiration_date = DateTime
            .fromISO(this.expiration_date_iso)
            .setZone(NYSE_ZONE)
            .set(NYSE_CLOSE);

        
    }
    time_to_expiration(format = ['days', 'hours']){
        const now = DateTime.local().setZone('America/New_York');
        return this.expiration_date.diff(now, format);

    }
    static toFixed(value, decimal_places = 3){
        return Number.parseFloat(value).toFixed(decimal_places);
    }
}
module.exports = Option;
/*
{
    "symbol": "VXX190517P00016000",
    "description": "VXX May 17 2019 $16.00 Put",
    "exch": "Z",
    "type": "option",
    "last": null,
    "change": null,
    "volume": 0,
    "open": null,
    "high": null,
    "low": null,
    "close": null,
    "bid": 0.0,
    "ask": 0.01,
    "underlying": "VXX",
    "strike": 16.0,
    "change_percentage": null,
    "average_volume": 0,
    "last_volume": 0,
    "trade_date": 0,
    "prevclose": null,
    "week_52_high": 0.0,
    "week_52_low": 0.0,
    "bidsize": 0,
    "bidexch": "J",
    "bid_date": 1557171657000,
    "asksize": 611,
    "askexch": "Z",
    "ask_date": 1557172096000,
    "open_interest": 10,
    "contract_size": 100,
    "expiration_date": "2019-05-17",
    "expiration_type": "standard",
    "option_type": "put",
    "root_symbol": "VXX",
    "greeks": {
        "delta": 1.0,
        "gamma": 1.95546E-10,
        "theta": -0.00204837,
        "vega": 3.54672E-9,
        "rho": 0.106077,
        "phi": -0.28801,
        "bid_iv": 0.0,
        "mid_iv": 0.0,
        "ask_iv": 0.0,
        "smv_vol": 0.380002,
        "updated_at": "2019-08-29 14:59:08"
    }
},
*/