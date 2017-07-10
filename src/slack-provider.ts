import Config from './config';
import { DeviceStatus } from './interfaces';
import fetch, { Request } from 'node-fetch';
import * as moment from 'moment';

class SlackProvider {
    currentStatus: {};
    
    constructor (status: {}) {
        this.currentStatus = status;
    }

    async sendAlerts(url: string) {
        for (let deviceId in this.currentStatus) {
            if (this.currentStatus.hasOwnProperty(deviceId)) {
                let status: DeviceStatus = this.currentStatus[deviceId];
                if ( moment().diff(moment(status.Threshold), 'minute') > status.Threshold ) {
                    let message = {
                        text: `${status.Name} has been ${status.Status} since ${moment(status.FirstSeen).fromNow()}`
                    };
                    let opts = {
                        method: 'Post',
                        body: JSON.stringify(message),
                    };
                    let response = await fetch(url, opts);
                }
            }
        }
    }
}

export default SlackProvider;