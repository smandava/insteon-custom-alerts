import api from './insteon';

class App {
    
    listDevices() {
        api.listDevices();
    }

}

new App().listDevices();