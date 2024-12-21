import { Configuration } from '../config/config';
import nodemailer from 'nodemailer';

class EmailHelper extends Configuration {
  transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.getEnviroment('EMAIL_USER'),
        pass: this.getEnviroment('EMAIL_PASS'),
      },
    });
  }

  async sendPasswordRecoveryMail(email: string, token: string) {
    const mailOptions = {
      from: this.getEnviroment('EMAIL_USER'),
      to: email,
      subject: 'Recuperacion de contraseña',
      html: `
            <h1>Recuperación de contraseña</h1>
            <p>Para recuperar tu contraseña haz click en el siguiente enlace:</p>
            <a href="${
              this.getEnviroment('CORS')?.split(' ')[0]
            }/pass/recovery?token=${token}">Recuperar contraseña</a>
        `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending the email', error);
      throw new Error('Error sending the email');
    }
  }
}

export default new EmailHelper();
