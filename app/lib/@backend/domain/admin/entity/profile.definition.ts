export interface IProfile {
  id: string;
  name: string;
  active: boolean;
  locked_control_code: string[];
  created_at: Date;
}
