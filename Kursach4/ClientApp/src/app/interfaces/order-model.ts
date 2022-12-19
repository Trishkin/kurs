import { Slot } from "./slot"

export interface OrderModel {
    id:number
    userId:number
    slotId:number
    slot:Slot
    startDate:Date
    endDate:Date
    price:number
    isComplete: boolean
}
