import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionsProjects {
  @ApiModelProperty({
    description: "The org name of the repo",
    example: "open-sauced",
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  org_id: string;

  @ApiModelProperty({
    description: "The project name of the repo",
    example: "api",
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  project_id: string;

  @ApiModelProperty({
    description: "The ID of the associated repo in the OpenSauced API context",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  repo_id: number;

  @ApiModelProperty({
    description: "The number of contributions associated with a org/repo",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  contributions: number;
}
