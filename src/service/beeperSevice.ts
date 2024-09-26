import fs from "fs/promises";
import { getFileData, saveFileData } from "../config/fileDataLayer";
import NewBepperDto from "../Dto/beeperDto";
import { Beeper, StatusEnum } from "../models/beeperModel";

export default class BeeperService {
  public static async createNewBeeper(
    newBeeper: NewBepperDto
  ): Promise<boolean> {
    //create a new beeper() object
    const { name } = newBeeper;
    const beeper: Beeper = new Beeper(name);
    //add it tp beeper file
    //get the file as an array of object
    let beepers: Beeper[] = (await getFileData()) as Beeper[];
    // push
    beepers.push(beeper);
    // save the array back to the file
    return await saveFileData(beepers);
  }

  public static async getAllBeepers(): Promise<Beeper[]> {
    const beepers: Beeper[] = (await getFileData()) as Beeper[];
    return beepers;
  }

  public static async getBeeperById(id: number): Promise<Beeper | undefined> {
    const allBeepers: Beeper[] = await this.getAllBeepers();
    return allBeepers.find((beeper) => beeper.id == id);
  }

  public static convertToEnum(str: string): StatusEnum | undefined {
    const statusValue = StatusEnum[str as keyof typeof StatusEnum];
    return statusValue;
  }

  public static async updateBeeperStatus(
    id: number,
    befferStatus: any,
    LAT = null,
    LON = null
  ): Promise<boolean | string> {
    const enumList = [
      "manufactured",
      "assembled",
      "shipped",
      "deployed",
      "detonated",
    ];
    const status = befferStatus.status;    
    const beepers: Beeper[] = (await this.getAllBeepers()) as Beeper[];
    const beeperIndex: number = beepers.findIndex((beeper) => beeper.id == id);
    const indexEnum: number = enumList.indexOf(beepers[beeperIndex].status);
    const indexOfStatus: number = enumList.indexOf(status);
    if (this.convertToEnum(status) != undefined) {
      if (
        beepers[beeperIndex].status == StatusEnum.detonated ||
        status == StatusEnum.manufactured ||
        indexOfStatus < indexEnum ||
        indexOfStatus == indexEnum
      ) {
        return "status not legal";
      }
      if (status == "deployed") {
        if (befferStatus.LAT && befferStatus.LON) {
          beepers[beeperIndex].status = this.convertToEnum(status)!;
          beepers[beeperIndex].latitude = befferStatus.LAT!;
          beepers[beeperIndex].longitude = befferStatus.LON!;
          await saveFileData(beepers);
          return "you apply deployed";
        } else {
          return "you didnt put LAT and LOT";
        }
      }
      beepers[beeperIndex].status = this.convertToEnum(status)!;
      await saveFileData(beepers);
      return true;
    }
    return false;
  }

  public static async deleteBeeper(id: number): Promise<Beeper> {
    const allBeepers: Beeper[] = await this.getAllBeepers();
    const indexBeeper: number = allBeepers.findIndex(
      (beeper) => beeper.id == id
    );
    const beeper = allBeepers[indexBeeper];
    const updatt = allBeepers.filter((beeper) => beeper.id != id);
    await saveFileData(updatt);
    return beeper;
  }

  public static async getBeepersByStatus(status: string): Promise<Beeper[]> {
    const allBeepers: Beeper[] = await this.getAllBeepers();
    return allBeepers.filter((beeper) => beeper.status == status);
  }

  public static async cheakIfDeployed(
    result: string | boolean,
    id: number
  ): Promise<void> {
    if (result == "you apply deployed") {
      const allBeepers: Beeper[] = await this.getAllBeepers();
      const indexOfBeeper: number = allBeepers.findIndex(
        (beeper) => beeper.id == id
      );
      allBeepers[indexOfBeeper].status = StatusEnum.detonated;
      await saveFileData(allBeepers);
    }
  }
}
