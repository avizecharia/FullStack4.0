import fs from "fs/promises";
import {Beeper} from "../models/beeperModel";

export const getFileData = async (): Promise<Beeper[] | void> => {
  try {
    // console.log("plppl");
    
    const strData: string = await fs.readFile(
      `${__dirname}/../../data/beeper.json`,
      "utf-8"
    );
    const parstData: Beeper[] = JSON.parse(strData);
    return parstData;
  } catch (err) {
    console.log(err);
  }
};

export const saveFileData = async (data: Beeper[]): Promise<boolean> => {
  try {
    const stringifyData: string = JSON.stringify(data, null, 2);
    await fs.writeFile(`${__dirname}/../../data/beeper.json`, stringifyData, {
      encoding: "utf-8",
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
