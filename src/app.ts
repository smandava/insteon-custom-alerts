import {Context} from 'aws-lambda';
import Config from './config';
import api from './insteon';
import {S3} from 'aws-sdk';
import {DeviceStatus} from './interfaces';

export async function handler (event: {} , context: Context|{}, callback: {} ) {
    let events = Config.getEvents();
    let currentStatus: DeviceStatus[] = [];
    for (let enentDetails of events){
         try {
            let status = await api.getDeviceStatus(enentDetails.DeviceId, enentDetails.DeviceType);
            let name = enentDetails.DeviceName;
            let id = enentDetails.DeviceId;
            currentStatus.push({
                Id: id,
                Name: name,
                Status: status
            });
        } catch (e) {
            throw e;
        }
    }
}