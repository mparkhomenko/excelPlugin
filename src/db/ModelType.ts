import { ModelCtor } from "sequelize";
import { Model, BuildOptions } from "sequelize/types";

export type ModelType<T extends Model> = ModelCtor<T> & {
  new (values?: object, options?: BuildOptions): T;
  associate: (models: {
    [key: string]: typeof Model & {
      new (values?: object, options?: BuildOptions): any;
    };
  }) => void;
};
