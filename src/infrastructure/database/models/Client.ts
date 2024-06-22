import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

const AddressSchema: Schema = new Schema({
  cep: { type: String, required: true, match: /^\d{8}$/ },
  street: { type: String, required: true, maxlength: 255 },
  neighborhood: { type: String, required: true, maxlength: 255 },
  city: { type: String, required: true, maxlength: 255 },
  state: { type: String, required: true, maxlength: 2, uppercase: true },
});

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, unique: true, maxlength: 255, match: /^\S+@\S+\.\S+$/ },
  phone: { type: String, required: true, unique: true, maxlength: 20, match: /^\d{10,20}$/ },
  address: { type: AddressSchema, required: true },
});

export const Client = mongoose.model<IClient>('Client', ClientSchema);
