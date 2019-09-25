import {
  Controller,
  Get,
  Render,
  Res,
  UseGuards,
  Post,
  Request,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InterviewService } from '../interview/interview.service';
import { getPreviewFromVideoLink } from '../../utils/youtube-preview.util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly interviewService: InterviewService,
  ) {}

  @Get()
  @Render('index')
  async getHello() {
    const pastInterviews = (await this.interviewService.getPast()).map(
      interview => {
        return {
          ...interview,
          ...{ preview: getPreviewFromVideoLink(interview.videoLink) },
        };
      },
    );

    return {
      comingInterviews: [
        {
          interviewer: 'Vasiliy Ivanov',
          interviewee: 'Petr Sidorov',
          videoLink: 'https://youtube.com',
        },
      ],
      pastInterviews,
    };
  }
}
