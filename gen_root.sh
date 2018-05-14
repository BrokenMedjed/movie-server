#!/usr/bin/env bash

if [ -z "$1" ]; then
	echo "usage: $0 <expiry time, years>"
	exit 1
fi

echo "[$0] Generating key"
openssl genrsa -out certs/root.key 2048
echo "[$0] Generating root CA"
openssl req -x509 -new -nodes -key certs/root.key -sha256 -days "$(( $1 * 365 ))" -out certs/root.pem
echo "[$0] Done"
