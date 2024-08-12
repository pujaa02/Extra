//controller.ts
@Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  adduser(@Body() body: UserCreateDto) {
    try {
      const result = this.userService.addUser(body);
    } catch (error) {
      return error;
    }
  }

//service.ts
  async addUser(user: UserCreateDto) {
    try {
      const salt: string = uuidv4();
      user.salt = salt;
      user.password = await argon2.hash(user.password + salt);
      const result = await this.userRepository.save(user);
      return {
        result,
        success: true,
        message: 'Successfully get all users',
      };
    } catch (error) {
      return { success: false, message: 'Error occured' };
    }
  }
