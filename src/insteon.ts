import Config from './config';
import fetch, { Response } from 'node-fetch';

class InsteonApi {
    
    static authenticationApiUrl = 'https://connect.insteon.com/api/v2/oauth2/token';
    static devicesApiUrl = 'https://connect.insteon.com/api/v2/devices?properties=all';
    
    private static bearerToken = undefined;
    private static authHeaders = undefined;

    static deviceInfoUrl = (deviceId: number) => `https://connect.insteon.com/api/v2/devices/${deviceId}`;

    static async getJsonProperty (message: Response, context: string, property: string) {
        let json = await InsteonApi.getJson(message, context);
        if (json.hasOwnProperty(property)) {
            return json[property];
        } else {
            console.log(`${property} not found in the response.`);

            throw new Error(`${context} failed.`);
        }
    }

    static async getJson (message: Response, context: string) {
        if ((message.status >= 200) && (message.status < 300)) {
            let json = await message.json();
            return json;
        } else {
            let body = await message.text();
            console.log(body);
            throw new Error(`${context} failed. ${message.status} - ${message.statusText}.`);
        }
    }

    static async getBearerToken() {
        if (InsteonApi.bearerToken === undefined) {
            let body = 
`grant_type=password&username=${Config.userName()}&password=${Config.password()}&client_id=${Config.apiKey()}`;

            let opts = {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            let response = await fetch(InsteonApi.authenticationApiUrl, opts);         
            let token = await InsteonApi.getJsonProperty(response, 'getBearerToken', 'access_token' );
            InsteonApi.bearerToken = token;
        }
        return InsteonApi.bearerToken;
    }

    static async getAuthHeaders() {
        if (InsteonApi.authHeaders === undefined) {
            let bearerToken = await InsteonApi.getBearerToken();
            InsteonApi.authHeaders = {
                'Authentication' : `APIKey ${Config.apiKey()}`,
                'Authorization' : `Bearer ${bearerToken}`
            };
        }
        return InsteonApi.authHeaders;
    }

    static async listDevices() {
        let headers = await InsteonApi.getAuthHeaders();
        let opts = {
            method: 'GET',
            headers: headers
        };

        let response = await fetch(InsteonApi.devicesApiUrl, opts);         
        let deviceListResp = await InsteonApi.getJson(response, 'listDevices');
        let deviceList = deviceListResp.DeviceList;
        if (Array.isArray(deviceList)) {
               let $devices = deviceList.map( (x) => {
                   let device = {
                       'DeviceId': x.DeviceID,
                       'DeviceType': 
                       (x.DeviceTypeTraits && x.DeviceTypeTraits.TypeDescription) ? 
                            x.DeviceTypeTraits.TypeDescription
                            : 'unknown',
                       'Name' : x.DeviceName
                   };
                   console.log(device); 
               }); 
        } else {
            console.log(deviceList);
        }
    }

    static async getDeviceInfo(deviceId: number) {
        try {
            let headers = await InsteonApi.getAuthHeaders();
            let opts = {
                method: 'GET',
                headers: headers
            };
            let response = await fetch(InsteonApi.deviceInfoUrl(deviceId), opts);
            let deviceInfo = await InsteonApi.getJson(response, 'getDeviceInfo');
            console.log(deviceInfo);
        } catch (e) {
            throw e;
        }
    }
}
export default InsteonApi;