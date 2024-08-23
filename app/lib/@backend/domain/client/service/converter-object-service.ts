import { IClient, OmieEnterprise } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util";
import _ from 'lodash';
import { InterceptionObjectConstants } from "../data-mapper/interception.object.constants";
import { IConverterObjectService } from "./@dto/converter.object.service";

class ConverterObjectService implements IConverterObjectService {
  public async execute(data: IConverterObjectService.Execute.Params): Promise<IConverterObjectService.Execute.Result> {
    const result = this.structureObject<IClient>(data);
    return result;
  }

  private structureObject<T>(data: any): T {
    const object = {} as T;
    const keys = Object.keys(InterceptionObjectConstants);
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(InterceptionObjectConstants, key)) {
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
  }: IConverterObjectService.MergeHelper.Params): IConverterObjectService.MergeHelper.Result {
    const currentCompany = Object.keys(currentObject.omie_code_metadata!) as OmieEnterprise[];
    const entityCompanies = Object.keys(entity.omie_code_metadata!) as OmieEnterprise[];
    const isSameCompany = currentCompany.find(company => entityCompanies.includes(company));
    if (!isSameCompany) {
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
  }: IConverterObjectService.MergeHelper.Params): IConverterObjectService.MergeHelper.Result {
    currentObject.contacts.forEach(contactObject => {
      const isSameContact = entity.contacts.find(contactEntity => {
        return contactEntity.phone === contactObject.phone;
      });

      if (!isSameContact) {
        entity.contacts.push(contactObject);
      }
    });


    return entity;
  }

  private mergeProps({
    currentObject,
    entity,
    excludeProps = []
  }: IConverterObjectService.MergeProps.Params): IConverterObjectService.MergeProps.Result {
    excludeProps.forEach((prop) => {
      delete currentObject[prop];
    })
    const mergeObject = _.merge(entity, currentObject);
    return mergeObject;
  }

  public margeObject({
    currentObject,
    entity
  }: IConverterObjectService.MergeHelper.Params): IConverterObjectService.MergeHelper.Result {
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

export const converterObjectService = singleton(ConverterObjectService)