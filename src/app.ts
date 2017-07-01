import {Context} from 'aws-lambda';
import Config from './config';
import api from './insteon';
import {S3} from 'aws-sdk';

export async function handler (event: {} , context: Context|{} ) {
    let events = Config.getEvents();
    for (let enentDetails of events){
         try {
                let status = await api.getDeviceStatus(enentDetails.DeviceId, enentDetails.DeviceType);
                console.log(status);
        } catch (e) {
            throw e;
        }
    }
}