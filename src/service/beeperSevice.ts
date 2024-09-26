import { getFileData, saveFileData } from "../config/fileDataLayer";
import NewBepperDto from "../Dto/beeperDto";
import StatusDto from "../Dto/statusDto";
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
    // save the array back to the  file
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
    const statusValue: StatusEnum = StatusEnum[str as keyof typeof StatusEnum];
    return statusValue;
  }

  public static async updateBeeperStatus(
    id: number,
    befferStatus: StatusDto
  ): Promise<boolean | string> {
    const enumList = [
      "manufactured",
      "assembled",
      "shipped",
      "deployed",
      "detonated",
    ];
    const status: string = befferStatus.status;
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
          return this.activeDeployed(
            beepers,
            befferStatus,
            beeperIndex,
            status
          );
        } else {
          return "you didnt put LAT and LOT";
        }
      }
      beepers[beeperIndex].status = this.convertToEnum(status)!;
      await saveFileData(beepers);
      return true;
    } else {
      if (indexEnum < 4) {
        const a: string = enumList[indexEnum + 1];
        beepers[beeperIndex].status = this.convertToEnum(a)!;
      }
      if (beepers[beeperIndex].status == "deployed") {
        if (befferStatus.LAT && befferStatus.LON) {
          return this.activeDeployed(
            beepers,
            befferStatus,
            beeperIndex,
            status
          );
        } else {
          return "you didnt put LAT and LON";
        }
      }
      await saveFileData(beepers);
      return true;
    }
    return false;
  }

  public static async activeDeployed(
    beepers: Beeper[],
    befferStatus: any,
    beeperIndex: number,
    status: string
  ): Promise<string> {
    beepers[beeperIndex].status = this.convertToEnum(status)!;
    beepers[beeperIndex].latitude = befferStatus.LAT!;
    beepers[beeperIndex].longitude = befferStatus.LON!;
    await saveFileData(beepers);
    return "you apply deployed";
  }

  public static async deleteBeeper(id: number): Promise<Beeper> {
    const allBeepers: Beeper[] = await this.getAllBeepers();
    const indexBeeper: number = allBeepers.findIndex(
      (beeper) => beeper.id == id
    );
    const beeper = allBeepers[indexBeeper];
    allBeepers.splice(indexBeeper, 1);
    await saveFileData(allBeepers);
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
      allBeepers[indexOfBeeper].detonated_at = new Date();
      await saveFileData(allBeepers);
    }
  }
}
