terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

resource "random_password" "rds" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-${var.env}-rds-subnet-group"
  subnet_ids = var.subnet_ids
  tags       = merge(var.tags, { Name = "${var.project}-${var.env}-rds-subnet-group" })
}

resource "aws_db_instance" "main" {
  identifier = "${var.project}-${var.env}"

  engine         = "postgres"
  engine_version = "16"
  instance_class = var.instance_class

  db_name  = "gymevolution"
  username = "gymevolution"
  password = random_password.rds.result

  allocated_storage     = var.allocated_storage
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id]

  multi_az               = var.multi_az
  publicly_accessible    = false
  skip_final_snapshot    = var.env == "dev"
  deletion_protection    = var.deletion_protection
  backup_retention_period = var.backup_retention_days

  auto_minor_version_upgrade = true
  apply_immediately          = var.env == "dev"

  tags = merge(var.tags, { Name = "${var.project}-${var.env}-rds" })
}

resource "aws_ssm_parameter" "database_url" {
  name  = "/gym-evolution/${var.env}/database-url"
  type  = "SecureString"
  value = "postgresql://${aws_db_instance.main.username}:${random_password.rds.result}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}?schema=public"
  tags  = var.tags
}

resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/gym-evolution/${var.env}/jwt-secret"
  type  = "SecureString"
  value = "REPLACE_ME_AFTER_APPLY"

  lifecycle {
    ignore_changes = [value]
  }

  tags = var.tags
}

resource "aws_ssm_parameter" "rapidapi_key" {
  name  = "/gym-evolution/${var.env}/rapidapi-key"
  type  = "SecureString"
  value = "REPLACE_ME_AFTER_APPLY"

  lifecycle {
    ignore_changes = [value]
  }

  tags = var.tags
}
