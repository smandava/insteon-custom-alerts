﻿import { Context } from 'aws-lambda';
import Config from './config';
import api from './insteon';
import S3Provider from './s3-provider';
import { DeviceStatus, DeviceStatusCode } from './interfaces';
import SlackProvider from './slack-provider';

export async function handler (event: {} , context: Context|{}, callback: {} ) {
    let events = Config.getEvents();
    let currentStatus = {};
    let log = false;
    for (let eventDetails of events){
         try {
            let status = await api.getDeviceStatus(eventDetails.DeviceId, eventDetails.DeviceType);
            let name = eventDetails.DeviceName;
            let id = eventDetails.DeviceId;
            currentStatus[id.toString()] = {
                Name: name,
                Status: status,
                Threshold: eventDetails.ThereshHoldInMinutes
            };
            if ( (status !== DeviceStatusCode.Closed ) &&
                 (status !== DeviceStatusCode.Off )
             ) {
                log = true;
            }
        } catch (e) {
            throw e;
        }
    }
    if (log) {
        console.log(currentStatus);
    }

    let storage = new S3Provider(Config.bucketName(), Config.docName());
    let mergedSatus = await storage.mergeStatus(currentStatus);
    storage.updateStatus(mergedSatus);
    let notifier = new SlackProvider(mergedSatus);
    await notifier.sendAlerts(Config.slackWebHook());

}