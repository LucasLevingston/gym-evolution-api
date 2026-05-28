variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "ecr_repository_arn" {
  type = string
}

variable "ssm_path_prefix" {
  type    = string
  default = "/gym-evolution"
}

variable "cloudwatch_log_group_arn" {
  type = string
}

variable "github_oidc_provider_arn" {
  description = "ARN of GitHub Actions OIDC provider (created in shared workspace)"
  type        = string
}

variable "github_org" {
  type    = string
  default = "LucasLevingston"
}

variable "github_repo_api" {
  type    = string
  default = "gym-evolution-api"
}

variable "tags" {
  type    = map(string)
  default = {}
}
