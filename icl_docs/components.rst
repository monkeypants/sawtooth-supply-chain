Components
==========

High Level Applications:

 * Any ICL App
 * Exporter FTA Delegated Authority App
 * Importer Customs App
 * Exporter Customs App

Each of these are designed as a collection of microservices.


Exporter Customs App
--------------------

Customs Authorities operate large, complex and evolving systems.
Qualities needed by APIs that supports these systems
need certain qualities:

 * scailable
 * reliable
 * resiliant

This is achieved with simple, stateless and horisontally-scalable microservices
that delgate state to scalable backing services.

CoO API:
 * PATCH /CoO/{id} ("export-declaration=true")
 * GET /CoO/{id}

`GET /CoO/{id}` queries an ES index,
and returns a JSON representation of the CoO.
This is "eventually consistent"
(it may not yet have been updated with recent blockchain transactions)

alternatives:
 * We may not need ES's indexing capability here,
   so something like S3 storage might be more appropriate.
 * We probably do want ES's indexing capability elseware
   (search and browse), so we may we well reuse it here.
 * We could use "serverless" component here (e.g. lambda)
   but ther is no point having it scale faster than ES can scale,
   so if we are using ES as a backing service
   then we should probably deploy this as a container
 
`PATCH /CoO/{id}`
is a lambda function
that posts a message to SQS.
It's really simple,
but it could possibly do some
validation, authorisation, etc.


PATCH Pipeline
^^^^^^^^^^^^^^

The result of the pipeline is to "chunk up"
appropriate batches of transactions
and submit them to the batch API of the blockchain node.

We need a technichal architecture
that is resiliant and scalable,
and can be tuned to maintain "good neibhour"
relations with other blockchain nodes.

Overview:
 * Pull PATCH CoO transactions from SQS and push them into kinesis
 * Pull batches of PATCH CoO transactions from kinesis and submit them to the batch API
 * log PATCH CoO transaction to S3 (using AWS FireHose)

There is a worker process
that pulls individual CoO PATCH tasks from SQS
and pushes them into a kinesis pipe.
This is containerised
(rather than serverless)
because it needs to be tuned
to harmonise with the kinesis write capacity.

There is a worker process
that pulls configurable sized batches
of CoO PATCH tasks from the kinesis pipe
and sends them to the batch API
of the blockchain node. 
This is containerised
(rather than serverless)
because it needs to be tuned
to harmonise with the kinesis read capacity.


Maintain CoO Index for analysis
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Rather than querying the blockchain nodes directly
the `GET /CoO/{id}` API uses an ES index
(or potentiall S3 repository, see notes above).

It does this for various reasons,
including the need to protect the node
from the need to service query traffic.

Thus, there is a supporting flow:

 * BlockChain Sync process observes updates to the chain, and writes CoO updates in a DB
 * When the CoO DB is updated, this dispatches an ES update job

Thus, ES is "eventually consistent"  with the blockchain.

There are also management/maintenance tasks
that recreate or refurbish ES
to ensure it is consistent
with the CoO DB.
This means ES can be
tuned for responsiveness
(rather than used as a durable store),
and the DB can be
backed-up and recovered in the usual way
(even though the DB could be recreated
from the blockchain,
this get's progressively slower
as time and transactions accumulate).

Django/Celery/Postgres(RDS)/Redis(ElasticCache)
may be a good stack for this,
since it gives us good ES management
without much implementation effort
(e.g. with Haystack or equivalent)
