export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  cep: string;
  address?: Address;
}

export interface Address {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}
