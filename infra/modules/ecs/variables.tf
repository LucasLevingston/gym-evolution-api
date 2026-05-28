variable "project" {
  type = string
}

variable "env" {
  type = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ecr_repository_url" {
  type = string
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "ecs_security_group_id" {
  type = string
}

variable "target_group_arn" {
  type = string
}

variable "execution_role_arn" {
  type = string
}

variable "task_role_arn" {
  type = string
}

variable "cpu" {
  type    = number
  default = 256
}

variable "memory" {
  type    = number
  default = 512
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "container_port" {
  type    = number
  default = 3333
}

variable "log_group_name" {
  type = string
}

# SSM parameter ARNs for secrets injection
variable "database_url_ssm_arn" {
  type = string
}

variable "jwt_secret_ssm_arn" {
  type = string
}

variable "redis_url_ssm_arn" {
  type = string
}

variable "rapidapi_key_ssm_arn" {
  type = string
}

# Autoscaling
variable "min_capacity" {
  type    = number
  default = 1
}

variable "max_capacity" {
  type    = number
  default = 3
}

variable "cpu_target_value" {
  type    = number
  default = 70
}

variable "tags" {
  type    = map(string)
  default = {}
}
