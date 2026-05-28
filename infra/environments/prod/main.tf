terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

locals {
  project = "gym-evolution"
  env     = "prod"
  common_tags = {
    Project     = "gym-evolution"
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}

# Reference shared resources created in infra/shared (run shared first)
data "aws_ecr_repository" "api" {
  name = "gym-evolution-api"
}

data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

module "networking" {
  source = "../../modules/networking"

  project              = local.project
  env                  = local.env
  vpc_cidr             = "10.1.0.0/16"
  public_subnet_cidrs  = ["10.1.1.0/24", "10.1.2.0/24"]
  private_subnet_cidrs = ["10.1.10.0/24", "10.1.11.0/24"]
  azs                  = ["us-east-1a", "us-east-1b"]
}

module "alb" {
  source = "../../modules/alb"

  project               = local.project
  env                   = local.env
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.networking.alb_sg_id
  container_port        = 3333
  health_check_path     = "/health"
}

module "cloudwatch" {
  source = "../../modules/cloudwatch"

  project                 = local.project
  env                     = local.env
  ecs_cluster_name        = "${local.project}-${local.env}"
  ecs_service_name        = "${local.project}-${local.env}-api"
  alb_arn_suffix          = module.alb.alb_arn_suffix
  target_group_arn_suffix = module.alb.target_group_arn_suffix
  log_retention_days      = 30
  alarm_email             = var.alarm_email
}

module "iam" {
  source = "../../modules/iam"

  project                  = local.project
  env                      = local.env
  ecr_repository_arn       = data.aws_ecr_repository.api.arn
  cloudwatch_log_group_arn = module.cloudwatch.log_group_arn
  github_oidc_provider_arn = data.aws_iam_openid_connect_provider.github.arn
  github_org               = "LucasLevingston"
  github_repo_api          = "gym-evolution-api"
}

module "rds" {
  source = "../../modules/rds"

  project               = local.project
  env                   = local.env
  subnet_ids            = module.networking.private_subnet_ids
  security_group_id     = module.networking.rds_sg_id
  instance_class        = "db.t3.small"
  allocated_storage     = 20
  multi_az              = true
  backup_retention_days = 30
  deletion_protection   = true
}

module "elasticache" {
  source = "../../modules/elasticache"

  project           = local.project
  env               = local.env
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.redis_sg_id
  node_type         = "cache.t3.small"
  num_cache_nodes   = 1
}

module "ecs" {
  source = "../../modules/ecs"

  project               = local.project
  env                   = local.env
  aws_region            = var.aws_region
  ecr_repository_url    = data.aws_ecr_repository.api.repository_url
  image_tag             = var.image_tag
  private_subnet_ids    = module.networking.private_subnet_ids
  ecs_security_group_id = module.networking.ecs_sg_id
  target_group_arn      = module.alb.target_group_arn
  execution_role_arn    = module.iam.ecs_execution_role_arn
  task_role_arn         = module.iam.ecs_task_role_arn
  log_group_name        = module.cloudwatch.log_group_name

  cpu           = 512
  memory        = 1024
  desired_count = 2
  min_capacity  = 2
  max_capacity  = 6

  database_url_ssm_arn = module.rds.database_url_ssm_arn
  jwt_secret_ssm_arn   = module.rds.jwt_secret_ssm_arn
  redis_url_ssm_arn    = module.elasticache.redis_url_ssm_arn
  rapidapi_key_ssm_arn = module.rds.rapidapi_key_ssm_arn
}
