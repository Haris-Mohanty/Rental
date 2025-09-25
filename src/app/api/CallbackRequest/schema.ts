import mongoose, { Schema, Document } from "mongoose";

export interface ICallbackRequest extends Document {
  phone: string;
  country: string;
  countryCode?: string;
  dialCode?: string;
  location?: {
    coords: string;
    address: string;
  };
  timestamp: Date;
}

const CallbackRequestSchema: Schema = new Schema({
  phone: { type: String, required: true },
  country: { type: String, required: true },
  countryCode: { type: String },
  dialCode: { type: String },
  location: {
    coords: { type: String },
    address: { type: String },
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.CallbackRequest ||
  mongoose.model<ICallbackRequest>("CallbackRequest", CallbackRequestSchema);
