interface UserDTO {
  user_id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  role?: string;
}

export default UserDTO;
