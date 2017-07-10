export enum DeviceType {
    IO_MODULE
}

export enum EventType {
    RunningTooLong
}

export enum DeviceStatusCode {
    On = 'On',
    Off = 'Off',
    Error = 'Error',
    TimeOut = 'Timeout'
}

export interface EventInfo {
    DeviceId: number;
    DeviceName: string;
    EventType: EventType;
    DeviceType: DeviceType;
    ThereshHoldInMinutes: number;
}

export interface DeviceStatus {
    Name: string;
    Status: DeviceStatusCode;
    FirstSeen?: number;
    Threshold?: number;
    PreviousStatus: DeviceStatusCode;
}