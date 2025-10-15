export interface IAccountEconomicGroup {
  id?: string | undefined;
  economic_group_holding?: EconomicGroup;
  economic_group_controlled?: EconomicGroup[];
}

export interface EconomicGroup {
  name: string;
  taxId: string;
}

export default IAccountEconomicGroup;
