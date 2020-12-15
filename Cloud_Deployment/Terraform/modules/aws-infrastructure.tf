# S3 bucket for saving twitter images
resource "aws_s3_bucket" "twitter_image_bucket" {
  bucket = var.bucket_name
  

  tags = {
    Name        = "twitter_clone_final_prj"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_policy" "twitter_image_bucket" {
  bucket = aws_s3_bucket.twitter_image_bucket.id

  policy = <<POLICY
{
    "Version": "2008-10-17",
    "Id": "mytwitterclone",
    "Statement": [
        {
            "Sid": "AllowingAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:PutObject","s3:PutObjectAcl", "s3:GetObject","s3:GetObjectAcl"],
            "Resource": "arn:aws:s3:::vikram-twitter-clone/*"
        }
    ]
}
POLICY
}