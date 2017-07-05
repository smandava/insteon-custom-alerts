export enum DeviceType {
    IO_MODULE
}

export enum EventType {
    RunningTooLong
}

export enum DeviceStatusCode {
    On,
    Off,
    Error,
    TimeOut
}

export interface EventInfo {
    DeviceId: number;
    DeviceName: string;
    EventType: EventType;
    DeviceType: DeviceType;
    ThereshHoldInMinutes: number;
}

export interface DeviceStatus {
    Id: number;
    Name: string;
    Status: DeviceStatusCode;
}