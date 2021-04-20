declare module "sequelize-mock" {
  import Sequelize from "sequelize";

  export default class SequelizeMock extends Sequelize {
    constructor(
      database?: string,
      username?: string,
      password?: string,
      options?: object
    );
    public define(name: string, obj: object, options?: object): any;
  }
}
