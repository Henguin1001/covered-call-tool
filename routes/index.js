var express = require('express');
var router = express.Router();
const Tradier = require('tradier-api');
const Stock_Model = require('../src/stock_model.js');

let api_key;
if(process.env.api_key){  
  api_key = process.env.api_key;
} else {
  api_key = require('../credentials.secret.json').api_key;
}


const stock_whitelist = {
  "QQQ": new Stock_Model(api_key, "QQQ"),
  "SLV": new Stock_Model(api_key, "SLV"),
  "GLD": new Stock_Model(api_key, "GLD")
}
router.get('/', async(req, res, next)=> {
  res.render('index.njk', {home:true });
});
/* GET home page. */
router.get('/:ticker', async(req, res, next)=> {
  const stock = stock_whitelist[req.params.ticker];
  if(stock){
    const quote = await stock.stock_lookup();
    const dates = await stock.expirations_dates(5);
    const first_date = dates[0][0].toFormat('yyyy-MM-dd');
    res.redirect(`/${req.params.ticker}/${first_date}`)
  }
});
router.get('/:ticker/:date', async(req, res, next)=> {
  try {
    const stock = stock_whitelist[req.params.ticker];
    if(stock){
      const quote = await stock.stock_lookup();
      const dates = await stock.expirations_dates(5);
      const chain = await stock.options_lookup(req.params.date, quote.last);
      res.render('index.njk', { ticker: req.params.ticker, simple:true, quote:quote, dates:dates, date:req.params.date, chain:chain});
    } else {
      res.write(`Stock ${req.params.ticker} not available`);
    }

  } catch(error) {
    if(error.response.data === "Invalid Parameter: expiration"){
      res.redirect(`/${req.params.ticker}`);
    } else {
      console.error(error);
    }
  }

});

module.exports = router;
 