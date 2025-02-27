import { Controller, Delete, Get, Param, ParseIntPipe, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { PageDto } from "../common/dtos/page.dto";
import { SupabaseGuard } from "../auth/supabase.guard";
import { UserId } from "../auth/supabase.user.decorator";
import { UpdateInsightDto } from "./dtos/update-insight.dto";

import { DbInsight } from "./entities/insight.entity";
import { InsightsService } from "./insights.service";
import { InsightPageOptionsDto } from "./dtos/insight-page-options.dto";

@Controller("insights")
@ApiTags("Insights service")
export class InsightController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findInsightPageById",
    summary: "Finds a insight page by :id",
  })
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Insight page not found" })
  @ApiUnauthorizedResponse({ description: "Not Authorized to view this Insight" })
  @ApiParam({ name: "id", type: "integer" })
  async findInsightPageById(@Param("id", ParseIntPipe) id: number): Promise<DbInsight> {
    return this.insightsService.findOneById(id);
  }

  @Get("/featured")
  @ApiOperation({
    operationId: "findFeaturedInsights",
    summary: "Finds featured insights",
  })
  @ApiOkResponse({ type: DbInsight })
  @ApiBadRequestResponse({ description: "Invalid request" })
  async findFeaturedInsights(@Query() pageOptionsDto: InsightPageOptionsDto): Promise<PageDto<DbInsight>> {
    return this.insightsService.findAllFeatured(pageOptionsDto);
  }

  @Delete("/:id")
  @ApiOperation({
    operationId: "removeInsightForUser",
    summary: "Removes an insight page for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Unable to remove user insight" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: UpdateInsightDto })
  @ApiParam({ name: "id", type: "integer" })
  async removeInsightForUser(@Param("id", ParseIntPipe) id: number, @UserId() userId: number): Promise<void> {
    const insight = await this.insightsService.findOneById(id);

    if (Number(insight.user.id) !== userId) {
      throw new UnauthorizedException();
    }

    await this.insightsService.removeInsight(id);
  }
}
