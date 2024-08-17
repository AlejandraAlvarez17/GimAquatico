import { UserModel } from "../../models/user.model.js";
import { createHash, isValidPassword } from "../../helpers/utils.js";
import CartManager from "./cartManager.js";
import { getLocaleTime } from "../../helpers/utils.js";
import CustomError from "../../helpers/errors/custom-error.js";
import {
  generateFieldUserErrorInfo,
  generateInvalidEmailUserErrorInfo,
  generateInvalidIdUserErrorInfo,
  generateNoDocumentationUserErrorInfo,
  generateNotFoundUserErrorInfo,
  generateSamePasswordUserErrorInfo,
} from "../../helpers/errors/info.js";
import { Errors } from "../../helpers/errors/enum.js";
import mongoose from "mongoose";

const cartManager = new CartManager();

class UserManager {
  createUser = async (user) => {
    try {
      if (!user.first_name || !user.last_name || !user.email || !user.age) {
        console.log("All fields are required");
        throw CustomError.createError({
          name: "All fields are required",
          cause: generateFieldUserErrorInfo(user),
          message: "Error when trying to create a user",
          code: Errors.ALL_FIELD_REQUIRED,
        });
      }

      const validate = await UserModel.findOne({ email: user.email });

      if (validate) {
        console.log(
          `Email ${user.email} is already in use - ${getLocaleTime()}`
        );
        throw CustomError.createError({
          name: "Email is already in use",
          cause: generateInvalidEmailUserErrorInfo(user.email),
          message: "Error when trying to create a user",
          code: Errors.INVALID_EMAIL,
        });
      }

      const cart = await cartManager.createCart();

      user.password = createHash(user.password);
      user.cartId = cart._id;
      user.role = user.email.includes("admin") ? "admin" : "user";

      const newUser = await UserModel.create(user);

      console.log(`User created - ${getLocaleTime()}`);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  readUsers = async () => {
    try {
      const users = await UserModel.find();

      return users;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  readUserByEmail = async (email) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        console.log(`User not exist - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Not found User",
          cause: generateNotFoundUserErrorInfo(),
          message: "Error when trying to read an user",
          code: Errors.NOT_FOUND,
        });
      }

      return user;
    } catch (err) {
      throw err;
    }
  };

  readUserValid = async (email, password) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        console.log("Invalid credentials");
        throw new Error("Invalid credentials");
      }

      if (!isValidPassword(password, user)) {
        console.log("Invalid password");
        throw new Error("Invalid password");
      }

      return user;
    } catch (err) {
      throw err;
    }
  };

  updateUserPassword = async (email, password) => {
    try {
      const user = await this.readUserByEmail(email);

      if (!user) {
        console.log(`Not found User - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Not found User",
          cause: generateNotFoundUserErrorInfo(),
          message: "Error when trying to update an user",
          code: Errors.NOT_FOUND,
        });
      }

      const samePassword = isValidPassword(password, user);

      if (samePassword) {
        console.log(`Same password - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Same password",
          cause: generateSamePasswordUserErrorInfo(),
          message: "Error when trying to update an user",
          code: Errors.SAME_PASSWORD,
        });
      }

      const userId = user._id;

      const userNewPassword = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: createHash(password),
        },
        {
          new: true,
        }
      );

      console.log(`Password reset - ${getLocaleTime()}`);
      return userNewPassword;
    } catch (err) {
      throw err;
    }
  };

  updateUserRole = async (email) => {
    try {
      const user = await this.readUserByEmail(email);

      if (!user) {
        console.log(`Not found User - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Not found User",
          cause: generateNotFoundUserErrorInfo(),
          message: "Error when trying to update an user",
          code: Errors.NOT_FOUND,
        });
      }

      const requiredDocumentation = ["identification", "proofOfAddress", "proofOfAccountStatus"];

      const userDocuments = user.documents.map(doc => doc.name);

      const hasDocumentation = requiredDocumentation.every(doc => userDocuments.includes(doc))

      if (!hasDocumentation) {
        console.log(`Missing documentation - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Missing documentation",
          cause: generateNoDocumentationUserErrorInfo(),
          message: "Error when trying to update an user",
          code: Errors.NO_DOCUMENTATION,
        });
      }

      const newRole = user.role === "user" ? "premium" : "user";

      const userId = user._id;

      const userNewRole = await UserModel.findByIdAndUpdate(
        userId,
        {
          role: newRole,
        },
        {
          new: true,
        }
      );

      console.log(`Changed role - ${getLocaleTime()}`);
      return userNewRole;
    } catch (err) {
      throw err;
    }
  };

  updateUserLastConnection = async (email) => {
    try {
      const user = await this.readUserByEmail(email);

      if (!user) {
        console.log(`Not found User - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Not found User",
          cause: generateNotFoundUserErrorInfo(),
          message: "Error when trying to update an user",
          code: Errors.NOT_FOUND,
        });
      }

      const userId = user._id;

      const userLastConnection = await UserModel.findByIdAndUpdate(
        userId,
        {
          last_connection: new Date(),
        },
        {
          new: true,
        }
      );

      console.log(`Set last connection - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      throw err;
    }
  };

  physicalDeleteUser = async (idU) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idU)) {
        console.log(
          `Invalid user ID - ${getLocaleTime()}`
        );
        throw CustomError.createError({
          name: "Invalid user ID",
          cause: generateInvalidIdUserErrorInfo(idU),
          message: "Error when trying to delete a user",
          code: Errors.INVALID_ID,
        });
      }

      const user = await UserModel.findById(idU);

      if (!user) {
        console.log(`User not exist - ${getLocaleTime()}`);
        throw CustomError.createError({
          name: "Not found User",
          cause: generateNotFoundUserErrorInfo(),
          message: "Error when trying to read an user",
          code: Errors.NOT_FOUND,
        });
      }

      const userDelete = await UserModel.findByIdAndDelete(idU)

      console.log(`User removed - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      throw err;
    }
  };
}

export default UserManager;