var express = require('express');
var router = express.Router();
const Tradier = require('tradier-api');
const credentials = require('../credentials.secret.json');
const Stock_Model = require('../src/stock_model.js');

const tradier = new Tradier(credentials.api_key, "sandbox");
const qqq = new Stock_Model();

/* GET home page. */
router.get('/QQQ', async(req, res, next)=> {
  const quote = await qqq.stock_lookup();
  const dates = await qqq.expirations_dates(5);
  res.render('index.njk', { title: 'QQQ Options', quote:quote, dates:dates, date:false});

});
router.get('/QQQ/:date', async(req, res, next)=> {
  try {
    const quote = await qqq.stock_lookup();
    const dates = await qqq.expirations_dates(5);
    const chain = await qqq.options_lookup(req.params.date, quote.last);
    res.render('index.njk', { title: 'QQQ Options', quote:quote, dates:dates, date:req.params.date, chain:chain});

  } catch(error) {
    console.error(error);
  }

});
// 
module.exports = router;
 