var express = require('express');
var router = express.Router();
const Tradier = require('tradier-api');
const credentials = require('../credentials.secret.json');
const Stock_Model = require('../src/stock_model.js');

const tradier = new Tradier(credentials.api_key, "sandbox");

const stock_whitelist = {
  "QQQ": new Stock_Model("QQQ"),
  "SLV": new Stock_Model("SLV"),
  "GLD": new Stock_Model("GLD")
}


/* GET home page. */
router.get('/:ticker', async(req, res, next)=> {
  const stock = stock_whitelist[req.params.ticker];
  if(stock){
    const quote = await stock.stock_lookup();
    const dates = await stock.expirations_dates(5);
    const first_date = dates[0][0].toFormat('yyyy-MM-dd');
    // res.render('index.njk', { ticker:req.params.ticker, quote:quote, dates:dates, date:false});
    // const first_date = dates[0][0].toFormat('yyyy-MM-dd');
    // res.write(first_date);
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
    }
    // console.error(error);
  }

});

// 
module.exports = router;
 