import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
/* 
HashService class: This is a service class decorated with @Injectable(), meaning it can be injected as a dependency in other parts of the application.
*/
@Injectable()
export class HashService {
  /* 
  This asynchronous method takes a password as input and returns a hashed version of it. It first generates a salt using bcrypt.genSalt(). A salt is a random string that is combined with the password to produce the hash, which helps protect against rainbow table attacks. The salt and password are then passed to bcrypt.hash() to produce the hashed password.
  */
  async hash(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return bcrypt.hash(password, saltOrRounds);
  }

  /* 
  This asynchronous method takes a plain-text password and a hashed password as inputs and returns a boolean indicating whether the plain-text password matches the hashed password. It uses bcrypt.compare(), which hashes the plain-text password with the salt used in the hashed password and checks if the result matches the hashed password.
  */
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
