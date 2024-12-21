import UserDTO from '../data/dto/user.dto';
import UserModel from '../data/models/user.model';
import jwt from 'jsonwebtoken';
import EmailHelper from '../helpers/email.helper';

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

      const users: UserDTO[] = rows.map((row) => {
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
}

export default new UserService();
