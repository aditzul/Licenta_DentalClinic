export enum Role {
    Admin =  0,
    Patient = 1,
    Medic =  2
}
export interface User {
    id: number;
    email: string;
    password: string;
    role: Role;
    createD_AT: string;
}