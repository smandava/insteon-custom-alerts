import {DeviceType, EventType, EventInfo} from './interfaces'

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
        return Config.propertyReader('API_KEY');
    }
    static userName(): string {
        return Config.propertyReader('INSTEON_USER_NAME');
    }
    static password(): string {
        return Config.propertyReader('INSTEON_PASSWORD');
    }

    static getEvents(): EventInfo[] {
        let events = Config.propertyReader('EVENTS');
        
        if (Array.isArray(events)) {
            return events.map(
                x => {
                    var event: EventInfo = {
                        DeviceId:  undefined,
                        DeviceType: undefined,
                        DeviceName: undefined,
                        ThereshHoldInMinutes: undefined,
                        EventType: undefined
                    };
                    for(let prop in event){
                        if (x.hasOwnProperty(prop)){
                            switch (prop) {
                                case 'DeviceId':
                                case 'ThereshHoldInMinutes':
                                    if (/^[1-9][0-9]*$/.test(x[prop].tostring())){
                                        event[prop]=parseInt(x[prop]);
                                    } else {
                                        console.log(x)
                                        throw new Error(`Invalid number for ${prop}`)
                                    }
                                case 'EventType':
                                case 'DeviceType':
                                    switch (x[prop]) {
                                        case 'I/O Module':
                                            event[prop] = DeviceType.IO_MODULE;
                                            break;
                                        case 'RunningTooLong':
                                            event[prop] = EventType.RunningTooLong;
                                            break;
                                        default:
                                            console.log(x);
                                            throw new Error(`Invalid value ${x[prop]} for ${prop}`);
                                    }
                                case 'Name': {
                                    if (x[prop] && /\S+/.test(x[prop])){
                                        event[prop]=x[prop];
                                    } else {
                                        console.log(x);
                                        throw new Error(`Invalid value $(x[prop]) for ${prop}`);
                                    }
                                }                                
                            }
                        } else {
                            console.log(x);
                            throw new Error(`Mossing required parameter ${prop}`);
                        }
                    }
                    return event;
                });
        } else {
            console.log(events);
            throw new Error('Event information is missing, check the template.');
        }
    }

}

export default Config;