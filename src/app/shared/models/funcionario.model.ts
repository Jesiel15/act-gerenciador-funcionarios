import { ProfileEnum } from '../enums/profile.enum';

export class FuncionarioModel {
  id!: string;
  name!: string;
  email!: string;
  document!: string;
  phone!: string;
  manager_name!: string;
  date_of_birth!: Date;
  profile!: ProfileEnum;
  password?: string;
}
