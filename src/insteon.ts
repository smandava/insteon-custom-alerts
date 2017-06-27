import Config from './config';
import fetch, { Response } from 'node-fetch';

class InsteonApi {
    
    static authenticationApiUrl = 'https://connect.insteon.com/api/v2/oauth2/token';
    static devicesApiUrl = "https://connect.insteon.com/api/v2/devices";
    private static bearerToken = undefined;
    private static authHeaders = undefined;

    static async readInsteonMessage (message: Response, context: string, property: string) {
        let json = await message.json();
        if (json.hasOwnProperty(property)) {
            return json[property];
        } else {
            console.log(`${property} not found in the response.`);
            console.log(message);
            throw new Error(`${context} failed.`);
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
            let token = await InsteonApi.readInsteonMessage(response, 'getBearerToken', 'access_token' );
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

        let headers = await InsteonApi.getAuthHeaders()
         let opts = {
                method: 'GET',
                headers: headers
            };

            let response = await fetch(InsteonApi.devicesApiUrl,opts);         
            let deviceList = await response.json();
            console.log(deviceList);
    }

}
export default InsteonApi;