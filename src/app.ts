import {Context} from '@types/aws-lambda';

exports.handler = function (event: any , context: Context ) {
    if (event !== null) {
        console.log('event = ' + JSON.stringify(event));
    } else {
        console.log('No event object');
    }
    context.done(null, 'Hello World');  // SUCCESS with message
};