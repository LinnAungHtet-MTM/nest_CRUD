import {
  Controller,
  Request,
  Response,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthRequestDto } from './dto/auth.request.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() createDto: CreateAuthRequestDto, @Response() res) {
    try {
      const { email, password } = createDto;
      const { token, data } = await this.authService.loginService(
        email,
        password,
      );
      return res
        .status(200)
        .json({ message: 'Login Successfully', token, data });
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  @Post('/change-password')
  async change(@Request() req, @Response() res) {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    await this.authService.changePassword(
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    );
    return res.status(200).json({ message: 'Changed password successfully!' });
  }

  @Post('/forget-password')
  async forget(@Request() req, @Response() res) {
    const { email } = req.body;
    await this.authService.forgetPassword(email);
    return res
      .status(200)
      .json({ message: 'Reset password link send to your email!' });
  }

  @Post('/reset-password/:id')
  async reset(@Request() req, @Response() res, @Param('id') id: string) {
    const { newPassword, confirmPassword } = req.body;
    await this.authService.resetPassword(id, newPassword, confirmPassword);
    res.status(200).json({ message: 'Reset Password Successfully' });
  }
}
