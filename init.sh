#!/usr/bin/env bash
echo "Environment: ${ENVIRONMENT} /n Segment: ${SEGMENT} /n Product: ${PRODUCT} /n Component: ${COMPONENT} /n Instance: ${COMPONENT_INSTANCE}"

CURDIR=`dirname "$0"`

# Install requirements 
yum install -y docker 
curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Substitute the endpoint localtion into the config
sed -i "s/SUB_ENDPOINT_ADDRESS_SUB/${ENDPOINT_FQDN}/g" ${CURDIR}/primary-node.yaml

# Run the docker-compose up
docker-compose -f ${CURDIR}/docker-compose.yaml up -d
