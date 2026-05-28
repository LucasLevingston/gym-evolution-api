resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project}-${var.env}-redis-subnet-group"
  subnet_ids = var.subnet_ids
  tags       = var.tags
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.project}-${var.env}"
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.node_type
  num_cache_nodes      = var.num_cache_nodes
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [var.security_group_id]

  snapshot_retention_limit = var.env == "prod" ? 1 : 0
  apply_immediately        = var.env == "dev"

  tags = merge(var.tags, { Name = "${var.project}-${var.env}-redis" })
}

resource "aws_ssm_parameter" "redis_url" {
  name  = "/gym-evolution/${var.env}/redis-url"
  type  = "SecureString"
  value = "redis://${aws_elasticache_cluster.main.cache_nodes[0].address}:${aws_elasticache_cluster.main.port}"
  tags  = var.tags
}
