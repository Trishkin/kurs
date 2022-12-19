import { Parking } from "./parking"

export interface Slot {
    id:number
    number:number
    parkingId:number
    parking: Parking
    isOccupied:boolean
}
