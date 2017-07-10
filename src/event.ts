import { EventInfo, DeviceType, EventType } from './interfaces';

class Event implements EventInfo {
    DeviceId = undefined;
    DeviceType = undefined;
    DeviceName = undefined;
    ThereshHoldInMinutes =  undefined;
    EventType = undefined;
    static FromJson(json: {}): EventInfo {
        var event = new Event();
        for (let prop in event) {
            if (json.hasOwnProperty(prop)) {
                switch (prop) {
                    case 'DeviceId':
                    case 'ThereshHoldInMinutes':
                        if (/^[1-9][0-9]*$/.test(json[prop].toString())) {
                            event[prop] = parseInt(json[prop], 0);
                        } else {
                            console.log(json);
                            throw new Error(`Invalid number for ${prop}`);
                        }
                        break;
                    case 'EventType':
                    case 'DeviceType':
                        switch (json[prop]) {
                            case 'I/O Module':
                                event[prop] = DeviceType.IO_MODULE;
                                break;
                            case 'RunningTooLong':
                                event[prop] = EventType.RunningTooLong;
                                break;
                            default:
                                console.log(json);
                                throw new Error(`Invalid value ${json[prop]} for ${prop}`);
                        }
                        break;
                    case 'DeviceName': 
                        if (json[prop] && /\S+/.test(json[prop])) {
                            event[prop] = json[prop];
                        } else {
                            console.log(json);
                            throw new Error(`Invalid value $(x[prop]) for ${prop}`);
                        }
                        break;
                    default:
                        console.log(`WARNING: unknown property ${prop}`);
                                                    
                }
            } else {
                console.log(json);
                throw new Error(`Missing required parameter ${prop}`);
            }
        }
        return event;
    }
}

export default Event;