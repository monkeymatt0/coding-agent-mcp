import { Transport } from "../types/Transport"

export interface TransportInterface {
     createTransport(type: string): Transport;
}