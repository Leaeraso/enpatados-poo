import UserDTO from '../data/dto/user.dto';
import UserModel from '../data/models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import EmailHelper from '../helpers/email.helper';
import ValidateHelper from '../helpers/validate.helper';
import bcrypt from 'bcryptjs';

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

      if (rows.length === 0) {
        throw new Error('Users not found');
      }

      const users: Partial<UserDTO>[] = rows.map((row) => {
        const { user_id, name, surname, email } = row.toJSON();
        return { user_id, name, surname, email };
      });

      const totalPages = Math.ceil(count / pageSize);

      return { users, totalPages, count };
    } catch (error: any) {
      console.error('Error trying to get the users', error);
      return { message: `Error: ${error.message}` };
    }
  }

  async passwordRecovery(email: string, SECRET_KEY: string) {
    try {
      const verificationToken = jwt.sign({ email: email }, SECRET_KEY, {
        expiresIn: '1h',
      });

      await EmailHelper.sendPasswordRecoveryMail(email, verificationToken);

      return { message: 'Email sent successfully' };
    } catch (error: any) {
      console.error('Error sending the email', error);
      return { message: `Error: ${error.message}` };
    }
  }

  async registerUser(user: UserDTO, SECRET_KEY: string, EXPIRE_TOKEN: string) {
    try {
      await ValidateHelper.validateData(UserModel, user);

      const existingUser = await UserModel.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        throw new Error('User already registered');
      }

      const hashPass = await bcrypt.hash(user.password, 10);

      const newUser = await UserModel.create({
        name: user.name,
        surname: user.surname,
        password: hashPass,
        email: user.email,
        date_of_birth: user.dateOfBirth,
      });

      const tokenInfo = {
        id: newUser.user_id,
        role: newUser.role,
        email: newUser.email,
      };

      const token = jwt.sign(tokenInfo, SECRET_KEY, {
        expiresIn: EXPIRE_TOKEN,
      });

      return token;
    } catch (error: any) {
      console.error('Error registering the user', error);
      return { message: `Error: ${error.message}` };
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
        throw new Error('User not found');
      }

      const validation = await bcrypt.compare(
        user.password!,
        existingUser.password!
      );

      if (!validation) {
        throw new Error('Invalid password');
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
    } catch (error: any) {
      console.error('Error login the user', error);
      return { message: `Error: ${error.message}` };
    }
  }

  async resetPassword(token: string, newPassword: string, SECRET_KEY: string) {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token not given');
      }

      if (!newPassword) {
        throw new Error('Invalid password');
      }

      const userEmail = await new Promise<string>((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
          if (err) {
            console.error(err);
            return reject('Invalid or expired token');
          }

          if (decoded && typeof decoded !== 'string' && 'email' in decoded) {
            resolve((decoded as JwtPayload).email);
          } else {
            reject('Invalid or expired token');
          }
        });
      });

      const user = await UserModel.findOne({ where: { email: userEmail } });

      if (!user) {
        throw new Error('User not found');
      }

      const hashPass = await bcrypt.hash(newPassword, 10);

      await user.update({ password: hashPass });

      return { message: 'password updated successfully' };
    } catch (error: any) {
      console.error('Error updating the password', error);
      return { message: `Error: ${error.message}` };
    }
  }

  async updateUser(updatedData: Partial<UserDTO>, id: number, role: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      if (updatedData.role && role !== 'admin') {
        throw new Error('You are not allowed to change the user role');
      }

      if (updatedData.password) {
        const hashPass = await bcrypt.hash(updatedData.password, 10);
        updatedData.password = hashPass;
      }

      await user.update(updatedData);

      return user;
    } catch (error: any) {
      console.error('Error updating the user', error);
      return { message: `Error: ${error.message}` };
    }
  }
}

export default new UserService();
