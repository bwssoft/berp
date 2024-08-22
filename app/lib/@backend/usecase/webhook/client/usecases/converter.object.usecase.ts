import { IClient, OmieEnterprise } from "@/app/lib/@backend/domain";
import { InterceptionObjectConstants } from "@/app/lib/@backend/domain/webhook/client/constants/intertection.object.constants";
import { IConverterObjectUsecase } from "@/app/lib/@backend/domain/webhook/client/usecases/converter.object.usecase";
import _ from 'lodash';

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
    const currentCompany = Object.keys(currentObject.omie_code_metadata!) as OmieEnterprise[];
    const entityCompanies = Object.keys(entity.omie_code_metadata!) as OmieEnterprise[];
    const isSameCompany = currentCompany.find(company => entityCompanies.includes(company));
    if(!isSameCompany) {
      entity['omie_code_metadata'] = {
        ...entity.omie_code_metadata!,
        ...currentObject.omie_code_metadata!
      };
    }

    return entity;
  }

  private checkContact({
    currentObject,
    entity
  }: IConverterObjectUsecase.MergeHelper.Params): IConverterObjectUsecase.MergeHelper.Result {
    currentObject.contacts.forEach(contactObject => {
      const isSameContact = entity.contacts.find(contactEntity => {
        return contactEntity.phone === contactObject.phone;
      });
  
      if(!isSameContact) {
        entity.contacts.push(contactObject);
      }
    });
    

    return entity;
  }

  private mergeProps({
    currentObject,
    entity,
    excludeProps = []
  }: IConverterObjectUsecase.MergeProps.Params): IConverterObjectUsecase.MergeProps.Result {
    excludeProps.forEach((prop) => {
      delete currentObject[prop];
    })
    const mergeObject = _.merge(entity, currentObject);
    return mergeObject;
  }

  public margeObject({
    currentObject,
    entity
  }: IConverterObjectUsecase.MergeHelper.Params): IConverterObjectUsecase.MergeHelper.Result {
    entity = this.checkCampanyOrigin({ currentObject, entity });    
    entity = this.checkContact({ currentObject, entity });
    entity = this.mergeProps({
      currentObject,
      entity,
      excludeProps: [
        'contacts', 
        'omie_code_metadata',
        'id', 
        'type',
        'created_at',
      ]
    });
    return entity;
  }
}