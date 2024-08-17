import { UserModel } from "../models/user.model.js";

export const deleteInactiveUsers = async () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  try {
    const result = await UserModel.deleteMany({
      last_connection: { $lt: twoDaysAgo },
    });
    console.log(`Deleted users: ${result.deletedCount}`);
  } catch (err) {
    console.log("Error deleting inactive users", err);
    console.error("Stack trace:", err.stack);
  }
};