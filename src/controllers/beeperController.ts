import exp, { Router, Request, Response, response } from "express";
import BeeperService from "../service/beeperSevice";
import { Beeper } from "../models/beeperModel";

const router: Router = exp.Router();

//create new beeper
router.post("/beepers", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await BeeperService.createNewBeeper(req.body);
    res.json({
      err: false,
      message: "create new beeper",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      err: true,
      message: "field to create new beeper",
      data: null,
    });
  }
});

//get all beeper
router.get("/beepers/", async (req: Request, res: Response): Promise<void> => {
  try {
    const allBeepers: Beeper[] = await BeeperService.getAllBeepers();
    res.json({
      err: false,
      message: "get all beepers was complete",
      data: allBeepers,
    });
  } catch (err) {
    res.status(400).json({
      err: true,
      message: "field to get all beepers",
      data: null,
    });
  }
});

// get specific beeper by id
router.get(
  "/beepers/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const beeper: Beeper = (await BeeperService.getBeeperById(
        +req.params.id
      )) as Beeper;
      // req.params.id
      res.json({
        err: false,
        message: "get beeper by id was complete ",
        data: beeper,
      });
    } catch (err) {
      res.status(400).json({
        err: true,
        message: "field to get beeper by id",
        data: null,
      });
    }
  }
);

// update the status of specific beeper by id
router.put(
  "/beepers/:id/status",
  async (req: Request, res: Response): Promise<void> => {
    const result: boolean | string = await BeeperService.updateBeeperStatus(
      +req.params.id,
      req.body
    );
    try {
      // req.params.id
      setTimeout(async () => {
        await BeeperService.cheakIfDeployed(result, +req.params.id);
      }, 10000);
      res.json({
        err: false,
        message: "update status was complete",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        err: true,
        message: "field to update status",
        data: null,
      });
    }
  }
);

// delete beeper by id
router.delete(
  "/beepers/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result: Beeper = await BeeperService.deleteBeeper(+req.params.id);
      // req.params.id

      res.json({
        err: false,
        message: "delete  beeper",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        err: true,
        message: "field to delete  beeper",
        data: null,
      });
    }
  }
);

router.get(
  "/beepers/status/:status",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result: Beeper[] = await BeeperService.getBeepersByStatus(
        req.params.status
      );
      // req.params.status

      res.json({
        err: false,
        message: "get all beepers by status",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        err: true,
        message: "field to get all beepers",
        data: null,
      });
    }
  }
);

export default router;
