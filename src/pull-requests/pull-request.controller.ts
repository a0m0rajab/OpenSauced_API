import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags, ApiParam } from "@nestjs/swagger";

import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PageDto } from "../common/dtos/page.dto";
import { FilterOptionsDto } from "../common/dtos/filter-options.dto";
import { DbPullRequest } from "./entities/pull-request.entity";
import { PullRequestService } from "./pull-request.service";
import { PullRequestPageOptionsDto } from "./dtos/pull-request-page-options.dto";
import { PullRequestInsightsService } from "./pull-request-insights.service";
import { DbPRInsight } from "./entities/pull-request-insight.entity";
import { DbPullRequestReview } from "./entities/pull-request-review.entity";
import { PullRequestReviewService } from "./pull-request-review.service";

@Controller("prs")
@ApiTags("Pull Requests service")
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    private readonly pullRequestsInsightService: PullRequestInsightsService,
    private readonly pullRequestReviewService: PullRequestReviewService
  ) {}

  @Get("/list")
  @ApiOperation({
    operationId: "listAllPullRequests",
    summary: "Finds all pull requests and paginates them",
  })
  @ApiPaginatedResponse(DbPullRequest)
  @ApiOkResponse({ type: DbPullRequest })
  async listAllPullRequests(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<DbPullRequest>> {
    return this.pullRequestService.findAll(pageOptionsDto);
  }

  @Get("/search")
  @ApiOperation({
    operationId: "searchAllPullRequests",
    summary: "Searches pull requests using filters and paginates them",
  })
  @ApiPaginatedResponse(DbPullRequest)
  @ApiOkResponse({ type: DbPullRequest })
  async searchAllPullRequests(@Query() pageOptionsDto: PullRequestPageOptionsDto): Promise<PageDto<DbPullRequest>> {
    return this.pullRequestService.findAllWithFilters(pageOptionsDto);
  }

  @Get("/insights")
  @ApiOperation({
    operationId: "getPullRequestInsights",
    summary: "Find pull request insights over the last 2 months",
  })
  @ApiOkResponse({ type: [DbPRInsight] })
  async getPullRequestInsights(@Query() pageOptionsDto: FilterOptionsDto): Promise<DbPRInsight[]> {
    return Promise.all(
      [30, 60].map(async (interval) => this.pullRequestsInsightService.getInsight(interval, pageOptionsDto))
    );
  }

  @Get("/:id/reviews")
  @ApiOperation({
    operationId: "getPullRequestReviews",
    summary: "Find all pull request reviews by pull request ID",
  })
  @ApiOkResponse({ type: [DbPullRequestReview] })
  @ApiParam({ name: "id", type: "string" })
  async getPullRequestReviews(@Param("id", ParseIntPipe) id: number): Promise<DbPullRequestReview[]> {
    return this.pullRequestReviewService.findAllReviewsByPrId(id);
  }
}
