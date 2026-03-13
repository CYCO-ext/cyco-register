
import { Exception } from './exception';

export class ForbiddenException extends Exception {
  constructor() {
    super('not authorized (forbidden)', 403);
  }
}
