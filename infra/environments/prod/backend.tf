terraform {
  backend "s3" {
    bucket         = "gym-evolution-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "gym-evolution-terraform-lock"
    encrypt        = true
  }
}
