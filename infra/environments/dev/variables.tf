variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "alarm_email" {
  type    = string
  default = ""
}
