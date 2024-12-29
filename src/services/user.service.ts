import UserDTO from '../data/dto/user.dto';
import UserModel from '../data/models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import EmailHelper from '../helpers/email.helper';
import ValidateHelper from '../helpers/validate.helper';
import bcrypt from 'bcryptjs';

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

class UserService {
  async getUsers(page: number, pageSize: number) {
    try {
      let options = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      const { count, rows } = await UserModel.findAndCountAll({
        ...options,
        distinct: true,
      });

      console.log(`count: ${count}
          rows: ${rows}
        `);

      if (rows.length === 0) {
        throw new NotFoundError('Users not found');
      }

      const users: Partial<UserDTO>[] = rows.map((row) => {
        const { user_id, name, surname, email } = row.toJSON();
        return { user_id, name, surname, email };
      });

      console.log('users', users);

      const totalPages = Math.ceil(count / pageSize);

      return { users, totalPages, count };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error trying to get the users');
    }
  }

  async passwordRecovery(email: string, SECRET_KEY: string) {
    try {
      const verificationToken = jwt.sign({ email: email }, SECRET_KEY, {
        expiresIn: '1h',
      });

      await EmailHelper.sendPasswordRecoveryMail(email, verificationToken);

      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error sending the email');
    }
  }

  async registerUser(user: UserDTO, SECRET_KEY: string, EXPIRE_TOKEN: string) {
    try {
      await ValidateHelper.validateData(UserModel, user);

      const existingUser = await UserModel.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        throw new BadRequestError('User already registered');
      }

      const hashPass = await bcrypt.hash(user.password, 10);

      const newUser = await UserModel.create({
        name: user.name,
        surname: user.surname,
        password: hashPass,
        email: user.email,
        date_of_birth: user.dateOfBirth,
      });

      console.log('ExpireIn:', EXPIRE_TOKEN);

      const tokenInfo = {
        id: newUser.user_id,
        role: newUser.role,
        email: newUser.email,
      };

      const token = jwt.sign(tokenInfo, SECRET_KEY, {
        expiresIn: EXPIRE_TOKEN,
      });

      return token;
    } catch (error) {
      throw new InternalServerError('Error registering the user');
    }
  }

  async loginUser(
    user: Partial<UserDTO>,
    SECRET_KEY: string,
    EXPIRE_TOKEN: string
  ) {
    try {
      const existingUser = await UserModel.findOne({
        where: { email: user.email },
      });

      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      const validation = await bcrypt.compare(
        user.password!,
        existingUser.password!
      );

      if (!validation) {
        throw new BadRequestError('Invalid password');
      }

      const tokenInfo = {
        id: existingUser.user_id,
        email: existingUser.email,
        role: existingUser.role,
      };

      const token = jwt.sign(tokenInfo, SECRET_KEY, {
        expiresIn: EXPIRE_TOKEN,
      });

      return token;
    } catch (error) {
      throw new InternalServerError('Error login the user');
    }
  }

  async resetPassword(token: string, newPassword: string, SECRET_KEY: string) {
    try {
      if (!token || typeof token !== 'string') {
        throw new BadRequestError('Token not given');
      }

      if (!newPassword) {
        throw new BadRequestError('Invalid password');
      }

      const decodedToken = jwt.verify(token, SECRET_KEY) as JwtPayload;
      console.log('token', token);

      if (!decodedToken || !decodedToken.email) {
        throw new Error('Invalid or expired token');
      }

      const user = await UserModel.findOne({
        where: { email: decodedToken.email },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password!);

      if (isSamePassword) {
        throw new BadRequestError('The password cannot be the same');
      }

      const hashPass = await bcrypt.hash(newPassword, 10);

      await user.update({ password: hashPass });

      return { message: 'password updated successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerError('Error updating the password');
    }
  }

  async updateUser(updatedData: Partial<UserDTO>, id: number, role: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (updatedData.role && role !== 'admin') {
        throw new UnauthorizedError(
          'You are not allowed to change the user role'
        );
      }

      if (updatedData.password) {
        const hashPass = await bcrypt.hash(updatedData.password, 10);
        updatedData.password = hashPass;
      }

      await user.update(updatedData);

      return user;
    } catch (error) {
      throw new InternalServerError('Error updating the user');
    }
  }
}

export default new UserService();
