import { Configuration } from '../config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../../data/models/user.model';

interface User {
  id: string;
  google_id: string | null;
  email: string;
  name: string;
  surname: string;
  role: string;
}

export class Passport extends Configuration {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  constructor() {
    super();
    this.GOOGLE_CLIENT_ID = this.getEnviroment('GOOGLE_CLIENT_ID')!;
    this.GOOGLE_CLIENT_SECRET = this.getEnviroment('GOOGLE_CLIENT_SECRET')!;
    passport.use(
      new GoogleStrategy(
        {
          clientID: this.GOOGLE_CLIENT_ID,
          clientSecret: this.GOOGLE_CLIENT_SECRET,
          callbackURL: `https://enpatados-production.up.railway.app/user/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const existingUser = await UserModel.findOne({
              where: { google_id: profile.id },
            });

            if (existingUser) {
              return done(null, {
                id: String(existingUser.user_id),
                google_id: existingUser.google_id,
                email: existingUser.email,
                name: existingUser.name,
                surname: existingUser.surname,
                role: existingUser.role,
              } as User);
            }

            const newUser = await UserModel.create({
              google_id: profile.id,
              email: profile.emails?.[0].value ?? 'noEmial@provide.com',
              name: profile.name?.givenName ?? 'noName',
              surname: profile.name?.familyName ?? 'noSurname',
            });

            return done(null, {
              id: String(newUser.user_id),
              google_id: newUser.google_id,
              email: newUser.email,
              name: newUser.name,
              surname: newUser.surname,
              role: newUser.role,
            } as User);
          } catch (error) {
            console.error('error creating the user', error);
            return done(error, undefined);
          }
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await UserModel.findByPk(Number(id));

        if (user) {
          done(null, {
            id: String(user.user_id),
            google_id: user.google_id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role,
          } as User);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, null);
      }
    });
  }
}
