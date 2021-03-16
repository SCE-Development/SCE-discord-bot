#!/bin/bash
set -e

mongo <<EOF
use $MONGO_DATABASE
db.createUser({
  user: '$MONGO_BOT_USER',
  pwd: '$MONGO_BOT_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_DATABASE'
  }]
})
EOF