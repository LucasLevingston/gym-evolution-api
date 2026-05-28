output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecr_repository_arn" {
  value = aws_ecr_repository.api.arn
}

output "github_oidc_provider_arn" {
  value = aws_iam_openid_connect_provider.github.arn
}
