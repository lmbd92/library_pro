import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AtGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  // canActivate: This method is called before the route handler. It determines whether the route can be accessed. It uses the Reflector to check if the 'IsPublic' metadata is set for the route handler or the controller class. If 'IsPublic' is true, the route can be accessed without authentication.
  canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context);
    const isPublic = this.reflector.getAllAndOverride('IsPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return Promise.resolve(true);

    return super.canActivate(context) as Promise<boolean>;
  }

  // handleRequest: This method is called after the JWT authentication is done. If there's an error or info message (usually when the JWT is expired or invalid), it logs the error and throws an HttpException with a 401 Unauthorized status. If there's no user (which means the JWT didn't contain valid user information), it logs a warning and throws an UnauthorizedException. If everything is fine, it simply returns the user.

  handleRequest(err, user, info: Error) {
    if (err || info) {
      this.logger.error(`JWT error: ${info.message || err}`);
      throw new HttpException('Token is expired!', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      this.logger.warn('Access Denied: Unauthorized access attempt');
      throw new UnauthorizedException('Access Denied.');
    }

    return user;
  }
}
