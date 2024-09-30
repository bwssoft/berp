import { IInput, IProduct, ITechnicalSheet } from "@/app/lib/@backend/domain";

export type IProductWithTechnicalSheet = IProduct & {
  technical_sheets: ITechnicalSheet[];
  inputs: IInput[];
};
