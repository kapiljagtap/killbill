var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15',region: 'us-west-2'});
    var instances = [];
    if(event.int != null && event.act != null){
       actEC2();
    }
    else{
        listEc2();
    }

    function listEc2(){
        var params = {};
        ec2.describeInstances(params, function(err, data) {
                if (err) {
                    callback(err, data);
                }
                else   {        
                    callback(null, { status: 'Ok', message: 'SUCCESS', result: data });
                }
            });
    }

    function actEC2(){
        var params = {InstanceIds: [event.int]};
            switch(event.act)
            {
                case "stop":
                    ec2.stopInstances(params, function(err, data) {
                        if (err){ 
                            callback(err, data);
                        }
                        else {     
                            callback(null, { status: 'Ok', message: 'SUCCESS', result: data });
                        }
                    })
                    break;
            }
    }
};