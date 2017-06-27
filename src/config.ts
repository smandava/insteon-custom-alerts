class Config {   
    static config: any = undefined;
    static propertyReader = (name: string) => {
        
        if (Config.config === undefined) {
            Config.config = require('../config.json');
        }

        if (Config.config.hasOwnProperty(name)) {
            return Config.config[name];
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
}

export default Config;