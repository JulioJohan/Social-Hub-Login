
export interface IUsuario {
    id_user:number;
    name: number;
    email: string;
    password: string;
    confirmed:boolean;
    email_verified:string;
    multi_factor_authentication:string;
    father_last_name:string;
    mother_last_name:string;
    age:string;
    date_birth:Date;
    avatar:string
  }