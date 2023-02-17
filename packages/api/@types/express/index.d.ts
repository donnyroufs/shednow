import express = require("express");
import type { UserEntity } from "../../src/app/core/entities/user.entity";

declare module "express" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Request {
    user: UserEntity;
  }
}
