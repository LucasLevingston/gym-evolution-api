output "endpoint" {
  value = aws_elasticache_cluster.main.cache_nodes[0].address
}

output "port" {
  value = aws_elasticache_cluster.main.port
}

output "redis_url_ssm_arn" {
  value = aws_ssm_parameter.redis_url.arn
}
