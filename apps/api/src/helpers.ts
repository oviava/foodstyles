import { Request } from 'express';
import { z, AnyZodObject } from 'zod';

export function parseExpressRequest<T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  return schema.parseAsync(req);
  // TODO: for simplicity sake we don't handle possible parsing errors here, for now we'll catch them in the route handler
}
