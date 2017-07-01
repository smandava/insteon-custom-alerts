import {DeviceType, EventType, EventInfo} from './interfaces';
import Event from './event';

class Config {   
    private static _config: {} = undefined;
    static propertyReader = (name: string) => {
        
        if (Config._config === undefined) {
            Config._config = require('../config.json');
        }

        if (Config._config.hasOwnProperty(name)) {
            return Config._config[name];
        } else {
            console.log(`Warning: attempting to read non existing configuration $(name)`);
            return undefined;
        }
    }

    static apiKey(): string {
        return Config.propertyReader('apiKey');
    }
    static userName(): string {
        return Config.propertyReader('insteonUserName');
    }
    static password(): string {
        return Config.propertyReader('insteonPassword');
    }

    static bucketName(): string {
        return Config.propertyReader('bucketName');
    }

    static docName(): string {
        return Config.propertyReader('docName');
    }
    
    static getEvents(): EventInfo[] {
        let events = Config.propertyReader('EVENTS');
        
        if (Array.isArray(events)) {
            return events.map((x) => Event.FromJson(x));
        } else {
            console.log(events);
            throw new Error('Event information is missing, check the template.');
        }
    }

}

export default Config;