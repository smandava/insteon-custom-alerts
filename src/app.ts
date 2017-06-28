import {Context} from '@types/aws-lambda';
import Config from './config';
import api from './insteon';

export async function handler (event: {} , context: Context|{} ) {
    let deviceIds = Config.getDeviceIds();
    
    for (let deviceId of deviceIds){
         try {
                await api.getDeviceInfo(deviceId);
            } catch (e) {
                throw e;
            }
    }
}