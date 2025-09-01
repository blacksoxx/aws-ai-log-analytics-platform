variable "prefix" {
  description = "Resource naming prefix"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}