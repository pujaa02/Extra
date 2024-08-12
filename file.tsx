import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { generalResponse } from './utils/general-response'; // Adjust the path as necessary
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  async addUser(@Body() body: UserCreateDto, @Res() res: Response) {
    try {
      const result = await this.userService.addUser(body);
      if (result.success) {
        return generalResponse(res, result.result, result.message, true, false, 201);
      } else {
        return generalResponse(res, {}, result.message, false, true, 400);
      }
    } catch (error) {
      return generalResponse(res, {}, 'An error occurred', false, true, 500);
    }
  }
}



import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserRepository } from './user.repository'; // Adjust the path as necessary
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async addUser(user: UserCreateDto) {
    try {
      const salt: string = uuidv4();
      user.salt = salt;
      user.password = await argon2.hash(user.password + salt);
      const result = await this.userRepository.save(user);
      return {
        result,
        success: true,
        message: 'Successfully added user',
      };
    } catch (error) {
      return { success: false, message: 'Error occurred' };
    }
  }
}
