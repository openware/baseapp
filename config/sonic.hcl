# Manage the kv v2 data
path "secret/data/deployment_id/*" {
  capabilities = ["create", "read", "list", "update"]
}

# Manage the kv v2 metadata
path "secret/metadata/deployment_id/*" {
  capabilities = ["create", "read", "list", "update"]
}

# Manage the transit secrets engine
path "transit/keys/deployment_id_kaigara_*" {
  capabilities = ["create", "read", "list"]
}

# Encrypt secrets data
path "transit/encrypt/deployment_id_kaigara_*" {
  capabilities = ["create", "read", "update"]
}

# Decrypt it's own secrets
path "transit/decrypt/deployment_id_kaigara_sonic" {
  capabilities = ["create", "read", "update"]
}

# Renew tokens
path "auth/token/renew" {
  capabilities = ["update"]
}

# Lookup tokens
path "auth/token/lookup" {
  capabilities = ["update"]
}
