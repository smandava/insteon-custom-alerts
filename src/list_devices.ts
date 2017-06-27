import api from './insteon';

class App {
    
    listDevices() {
        api.getAuthHeaders();
    }

}

new App().listDevices();