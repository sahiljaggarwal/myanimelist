import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({ status: 200, description: 'Initiate Google Login' })
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @ApiResponse({
    status: 200,
    description: 'Handle Google Login Callback',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @Req() req,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const { googleId, displayName, email } = req.user;
      const user = await this.authService.findOrCreateUser(
        googleId,
        displayName,
        email,
      );
      const token = await this.authService.generateJwtToken(user);
      console.log('token', token);
      console.log('user', user);
      return new SuccessResponse(
        { message: 'Login Successfully', token },
        true,
      );
    } catch (error) {
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
