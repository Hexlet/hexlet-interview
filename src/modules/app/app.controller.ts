import { Controller, Get, Render } from '@nestjs/common';
import { InterviewService } from '../interview/interview.service';
import { Interview, interviewState } from '../interview/interview.entity';
import { getPreviewFromVideoLink } from '../../common/utils/youtube-preview.util';
import { User } from '../user/user.entity';
import { ReqUser } from '../../common/decorators/req-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  @Render('index')
  async index(
    @ReqUser() user: User,
  ): Promise<{
    comingInterviews: InterviewWithPreview[];
    pastInterviews: InterviewWithPreview[];
    userComingInterviews: Interview[] | undefined;
  }> {
    const pastInterviews = (await this.interviewService.get({
      where: { state: 'passed' },
      relations: ['interviewee', 'interviewer'],
    })).map(interview => {
      return {
        ...interview,
        preview: getPreviewFromVideoLink(interview.videoLink),
      } as InterviewWithPreview;
    });

    const comingInterviews = (await this.interviewService.get({
      where: { state: 'coming' },
      relations: ['interviewee', 'interviewer'],
    })).map(interview => {
      return {
        ...interview,
        preview: getPreviewFromVideoLink(interview.videoLink),
      } as InterviewWithPreview;
    });

    let userComingInterviews: Interview[] | undefined;

    if (user) {
      userComingInterviews = await this.interviewService.get({
        where: {
          interviewee: user,
          state: interviewState.COMING,
        },
        relations: ['interviewer'],
      });
    }

    return { comingInterviews, pastInterviews, userComingInterviews };
  }
}

type InterviewWithPreview = Interview & { preview: string };
