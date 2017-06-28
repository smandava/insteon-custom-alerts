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

    static getDeviceIds(): number[] {
        let events = Config.propertyReader('EVENTS');
        
        if (Array.isArray(events)) {
            return events.map(
                x => {
                    if (x.hasOwnProperty('DEVICE_ID')) {
                        return Number.parseInt(x.DEVICE_ID);
                    } else {
                        console.log(x);
                        throw new Error('DEVICE_ID property not found in the event.');
                    }
                    
                });
        } else {
            console.log(events);
            throw new Error('Event information is missing, check the template..');
        }
    }

}

export default Config;