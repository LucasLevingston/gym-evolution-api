output "endpoint" {
  value = aws_db_instance.main.endpoint
}

output "port" {
  value = aws_db_instance.main.port
}

output "db_name" {
  value = aws_db_instance.main.db_name
}

output "database_url_ssm_arn" {
  value = aws_ssm_parameter.database_url.arn
}

output "jwt_secret_ssm_arn" {
  value = aws_ssm_parameter.jwt_secret.arn
}

output "rapidapi_key_ssm_arn" {
  value = aws_ssm_parameter.rapidapi_key.arn
}
