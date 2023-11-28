import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { AnimeDto } from '../dtos/anime.dto';

@Controller('anime')
export class AnimeController {
  constructor() {}
}
