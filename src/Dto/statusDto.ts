import { StatusEnum } from "../models/beeperModel";

export default interface StatusDto {
  status: StatusEnum
  LAT?: number
  LON?: number
}
