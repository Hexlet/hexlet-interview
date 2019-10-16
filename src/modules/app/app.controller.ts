import { Controller, Get, Render } from '@nestjs/common';
import { InterviewService } from '../interview/interview.service';
import { Interview } from '../interview/interview.entity';
import { getPreviewFromVideoLink } from '../../common/utils/youtube-preview.util';

@Controller()
export class AppController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  @Render('index')
  async index(): Promise<{ comingInterviews: InterviewWithPreview[]; pastInterviews: InterviewWithPreview[] }> {
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

    return { comingInterviews, pastInterviews };
  }
}

type InterviewWithPreview = Interview & { preview: string };
