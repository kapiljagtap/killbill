var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    
    var config = { 
      apiVersion: '2018-09-14',
      region : 'us-east-1'
    }
    
    var costexplorer = new AWS.CostExplorer(config);
    
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
    
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
    
      return [year, month, day].join('-');
    }
    
    var endDate = new Date();
    var  startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    console.log('Start date: ' + formatDate(startDate));
    console.log('End date: ' + formatDate(endDate));
    
    var params = {

    Granularity: 'MONTHLY',
    GroupBy: [ 
      { 
         Key: "SERVICE",
         Type: "DIMENSION"
      }
    ],
    Metrics: [
      'BlendedCost',
      'UnblendedCost',
      'UsageQuantity'
    ],
    TimePeriod: {
      End: formatDate(endDate), /* required */
      Start: formatDate(startDate) /* required */
    }
  };

  costexplorer.getCostAndUsage(params , (err, data) => {
      
      if (err) {
                   callback(err, data);
               }
               else {
                   callback(null, { status: 'Ok', message: 'Cost and usage data fetched succesfully', result: data });
               }
  });

};