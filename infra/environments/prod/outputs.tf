output "api_url" {
  description = "API base URL (HTTP via ALB)"
  value       = module.alb.api_url
}

output "ecr_repository_url" {
  description = "ECR URL for docker push (shared between environments)"
  value       = data.aws_ecr_repository.api.repository_url
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "rds_endpoint" {
  value     = module.rds.endpoint
  sensitive = true
}

output "github_actions_role_arn" {
  description = "Add to GitHub secret AWS_ROLE_ARN_PROD"
  value       = module.iam.github_actions_role_arn
}
