import { IClient } from "@/app/lib/@backend/domain";
import { InterceptionObjectConstants } from "@/app/lib/@backend/domain/webhook/client/constants/intertection.object.constants";
import { IConverterObjectUsecase } from "@/app/lib/@backend/domain/webhook/client/usecases/converter.object.usecase";

export class ConverterObjectUseCase implements IConverterObjectUsecase {
  public async execute(data: IConverterObjectUsecase.Execute.Params): Promise<IConverterObjectUsecase.Execute.Result> {
    const result = this.structureObject<IClient>(data);
    return result;
  }

  private structureObject<T>(data: any): T {
    const object = {} as T;
    const keys = Object.keys(InterceptionObjectConstants);
    keys.forEach((key) => {
      if(Object.prototype.hasOwnProperty.call(InterceptionObjectConstants, key)) {
        if (Object.prototype.hasOwnProperty.call(InterceptionObjectConstants, key)) {
          const func = InterceptionObjectConstants[key as keyof typeof InterceptionObjectConstants]!;
    
          if (key.includes('.')) {
            const [parentKey, childKey] = key.split('.');
    
            if (!object[parentKey as keyof T]) {
              object[parentKey as keyof T] = {} as T[keyof T];
            }
    
            // @ts-ignore
            object[parentKey][childKey] = func(data);
          } else {
            object[key as keyof T] = func(data);
          }
        }
      }
    });

    return object;
  }

  private checkCampanyOrigin({
    currentObject,
    entity
  }: IConverterObjectUsecase.MergeHelper.Params): IConverterObjectUsecase.MergeHelper.Result {
    const isSameCompany = entity.omie_code_metadata.find(omie => {
      return omie.enterprise === currentObject.omie_code_metadata[0].enterprise;
    });

    if(!isSameCompany) {
      entity.omie_code_metadata.push(currentObject.omie_code_metadata[0]);
    }

    return entity;
  }

  private checkContact({
    currentObject,
    entity
  }: IConverterObjectUsecase.MergeHelper.Params): IConverterObjectUsecase.MergeHelper.Result {
    const isSameContact = entity.contacts.find(contact => {
      return contact.phone === currentObject.contacts[0].phone;
    });

    if(!isSameContact) {
      entity.contacts.push(currentObject.contacts[0]);
    }

    return entity;
  }

  private mergeProps()

  public margeObject({
    currentObject,
    entity
  }: IConverterObjectUsecase.MergeHelper.Params): IConverterObjectUsecase.MergeHelper.Result {
    entity = this.checkCampanyOrigin({ currentObject, entity });    
    entity = this.checkContact({ currentObject, entity });
    return entity;
  }
}