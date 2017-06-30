export enum DeviceType{
    IO_MODULE
};

export enum EventType{
    RunningTooLong
};


export interface EventInfo{
    DeviceId: number,
    DeviceName: string,
    EventType: EventType,
    DeviceType: DeviceType,
    ThereshHoldInMinutes: number
};
