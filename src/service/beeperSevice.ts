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
    status: string,
    LAT = null,
    LON = null
  ): Promise<boolean> {
    const beepers: Beeper[] = (await this.getAllBeepers()) as Beeper[];
    const beeperIndex: number = beepers.findIndex((beeper) => beeper.id == id);

    if (this.convertToEnum(status) != undefined) {
      if (beepers[beeperIndex].status != StatusEnum.deployed) {
        if (status == "deployed") {
          if (LAT && LON) {
            beepers[beeperIndex].status = this.convertToEnum(status)!;
            beepers[beeperIndex].latitude = LAT!;
            beepers[beeperIndex].longitude =LON!;
            await saveFileData(beepers);
            return true;
          }
        }
        beepers[beeperIndex].status = this.convertToEnum(status)!;
        await saveFileData(beepers);
        return true;
      }
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
}
