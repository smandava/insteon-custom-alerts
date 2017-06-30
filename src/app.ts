import {Context} from 'aws-lambda';
import Config from './config';
import api from './insteon';

export async function handler (event: {} , context: Context|{} ) {
    let events = Config.getEvents();
    
    for (let event of events){
         try {
                await api.getDeviceStatus(event.DeviceId,event.DeviceType);
            } catch (e) {
                throw e;
            }
    }
}