export enum StatusEnum {
  manufactured = "manufactured",
  assembled = "assembled",
  shipped = "shipped",
  deployed = "deployed",
  detonated = "detonated",
}

export class Beeper {
  public id: number;
  public status: StatusEnum = StatusEnum.manufactured;
  public created_at: Date;
  public detonated_at?: Date ;
  public latitude: number;
  public longitude: number;

  constructor(
    public name: string
) {
    this.id = +Math.random().toString().split(".")[1];
    this.created_at = new Date();
    this.latitude = 0;
    this.longitude = 0;
  }
}



