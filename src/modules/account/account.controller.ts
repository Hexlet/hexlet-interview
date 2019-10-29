import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Interview, interviewState } from '../interview/interview.entity';
import { InterviewService } from '../interview/interview.service';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard } from '../../common/guards';
import { User } from '../user/user.entity';

@Controller('my')
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(public interviewService: InterviewService, public userService: UserService) {}

  @Get('/application')
  @Render('account/application')
  async getUserApplictions(@ReqUser() user: User): Promise<{ userApplications: Interview[] }> {
    const userApplications = await this.interviewService.get({
      where: {
        interviewee: user,
        state: interviewState.WAIT_FOR_INTERVIEWER,
      },
      order: { createdAt: 'DESC' },
    });
    return { userApplications };
  }
}
