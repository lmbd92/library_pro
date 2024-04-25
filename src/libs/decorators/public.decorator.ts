import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('IsPublic', true);
