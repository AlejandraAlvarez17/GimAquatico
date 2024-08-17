import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, requiered: true },
  status: { type: Boolean },
});

ticketSchema.set("timestamps", {
  createdAt: "purchase_datetime",
  updatedAt: false
});

export const TicketModel = mongoose.model(ticketsCollection, ticketSchema);