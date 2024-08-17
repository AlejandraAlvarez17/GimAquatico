import { TicketModel } from "../../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";
import { getLocaleTime } from "../../helpers/utils.js";
import mongoose from "mongoose";
import CustomError from "../../helpers/errors/custom-error.js";
import {
  generateFieldTicketErrorInfo,
  generateInvalidIdTicketErrorInfo,
  generateNotFoundTicketErrorInfo,
} from "../../helpers/errors/info.js";
import { Errors } from "../../helpers/errors/enum.js";

class TicketManager {
  createTicket = async (ticket) => {
    try {
      if (!ticket.amount || !ticket.purchaser) {
        console.log(`All fields are required - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "All fields are required",
          cause: generateFieldTicketErrorInfo(ticket),
          message: "Error when trying to create a ticket",
          code: Errors.ALL_FIELD_REQUIRED,
        });
      }

      const newTicket = {
        code: uuidv4(),
        amount: ticket.amount,
        purchaser: ticket.purchaser,
        status: true,
      };

      const result = await TicketModel.create(newTicket);

      console.log(`Ticket saved - ${getLocaleTime()}`);
      return result;
    } catch (err) {
      throw err;
    }
  };

  readTickets = async () => {
    try {
      const tickets = await TicketModel.find();

      return tickets;
    } catch (err) {
      console.log(`No tickets - ${getLocaleTime()}`);
      return [];
    }
  };

  logicalDeleteTicket = async (idT) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idT)) {
        console.log(`Invalid ticket ID - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Invalid ticket ID",
          cause: generateInvalidIdTicketErrorInfo(idT),
          message: "Error when trying to delete a ticket",
          code: Errors.INVALID_ID,
        });
      }

      const updatedTicket = await TicketModel.findByIdAndUpdate(
        idT,
        { status: false },
        { new: true }
      );

      if (!updatedTicket) {
        console.log(`Not found Ticket - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Not found Ticket",
          cause: generateNotFoundTicketErrorInfo(),
          message: "Error when trying to detele a ticket",
          code: Errors.NOT_FOUND,
        });
      }

      console.log(`Ticket removed - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      throw err;
    }
  };
}

export default TicketManager;