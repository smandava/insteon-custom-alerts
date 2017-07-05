import {Context} from 'aws-lambda';
import Config from './config';
import api from './insteon';
import S3Provider from './s3-provider';
import {DeviceStatus} from './interfaces';

export async function handler (event: {} , context: Context|{}, callback: {} ) {
    let events = Config.getEvents();
    let currentStatus = {};
    for (let enentDetails of events){
         try {
            let status = await api.getDeviceStatus(enentDetails.DeviceId, enentDetails.DeviceType);
            let name = enentDetails.DeviceName;
            let id = enentDetails.DeviceId;
            currentStatus[id.toString()] = {
                Name: name,
                Status: status
            };
        } catch (e) {
            throw e;
        }
    }
    console.log(currentStatus);
    let storage = new S3Provider(Config.bucketName(), Config.docName());
    let mergedSatus = await storage.mergeStatus(currentStatus);
    console.log(mergedSatus);
    storage.updateStatus(mergedSatus);

}