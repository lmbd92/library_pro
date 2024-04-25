import { SetMetadata } from '@nestjs/common';

export const Private = () => {
  return SetMetadata('IsPrivate', true);
};
