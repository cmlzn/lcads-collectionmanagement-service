# EVENT GUIDE

## lcads-collectionmanagement-service

Manages institutional and personal collections of digitized documents, assignment of documents to collections, favorites, classification, curation audit trail, and visibility/privacy settings for libraries and end users.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `CollectionManagement` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `CollectionManagement` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `CollectionManagement` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `CollectionManagement` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `CollectionManagement` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent collection-created

**Event topic**: `lcads-collectionmanagement-service-dbevent-collection-created`

This event is triggered upon the creation of a `collection` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "description": "Text",
  "type": "Enum",
  "type_": "String",
  "themeTags": "String",
  "institution": "String",
  "visibility": "Enum",
  "visibility_": "String",
  "ownerUserId": "ID",
  "curatorUserIds": "ID",
  "auditNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent collection-updated

**Event topic**: `lcads-collectionmanagement-service-dbevent-collection-updated`

Activation of this event follows the update of a `collection` data object. The payload contains the updated information under the `collection` attribute, along with the original data prior to update, labeled as `old_collection`.

**Event payload**:

```json
{
  "old_collection": {
    "id": "ID",
    "_owner": "ID",
    "title": "String",
    "description": "Text",
    "type": "Enum",
    "type_": "String",
    "themeTags": "String",
    "institution": "String",
    "visibility": "Enum",
    "visibility_": "String",
    "ownerUserId": "ID",
    "curatorUserIds": "ID",
    "auditNotes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "collection": {
    "id": "ID",
    "_owner": "ID",
    "title": "String",
    "description": "Text",
    "type": "Enum",
    "type_": "String",
    "themeTags": "String",
    "institution": "String",
    "visibility": "Enum",
    "visibility_": "String",
    "ownerUserId": "ID",
    "curatorUserIds": "ID",
    "auditNotes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent collection-deleted

**Event topic**: `lcads-collectionmanagement-service-dbevent-collection-deleted`

This event announces the deletion of a `collection` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "description": "Text",
  "type": "Enum",
  "type_": "String",
  "themeTags": "String",
  "institution": "String",
  "visibility": "Enum",
  "visibility_": "String",
  "ownerUserId": "ID",
  "curatorUserIds": "ID",
  "auditNotes": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent collectionDocument-created

**Event topic**: `lcads-collectionmanagement-service-dbevent-collectiondocument-created`

This event is triggered upon the creation of a `collectionDocument` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "documentMetadataId": "ID",
  "assignedByUserId": "ID",
  "notes": "Text",
  "orderInCollection": "Integer",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent collectionDocument-updated

**Event topic**: `lcads-collectionmanagement-service-dbevent-collectiondocument-updated`

Activation of this event follows the update of a `collectionDocument` data object. The payload contains the updated information under the `collectionDocument` attribute, along with the original data prior to update, labeled as `old_collectionDocument`.

**Event payload**:

```json
{
  "old_collectionDocument": {
    "id": "ID",
    "_owner": "ID",
    "collectionId": "ID",
    "documentMetadataId": "ID",
    "assignedByUserId": "ID",
    "notes": "Text",
    "orderInCollection": "Integer",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "collectionDocument": {
    "id": "ID",
    "_owner": "ID",
    "collectionId": "ID",
    "documentMetadataId": "ID",
    "assignedByUserId": "ID",
    "notes": "Text",
    "orderInCollection": "Integer",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent collectionDocument-deleted

**Event topic**: `lcads-collectionmanagement-service-dbevent-collectiondocument-deleted`

This event announces the deletion of a `collectionDocument` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "documentMetadataId": "ID",
  "assignedByUserId": "ID",
  "notes": "Text",
  "orderInCollection": "Integer",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent favorite-created

**Event topic**: `lcads-collectionmanagement-service-dbevent-favorite-created`

This event is triggered upon the creation of a `favorite` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "documentMetadataId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent favorite-updated

**Event topic**: `lcads-collectionmanagement-service-dbevent-favorite-updated`

Activation of this event follows the update of a `favorite` data object. The payload contains the updated information under the `favorite` attribute, along with the original data prior to update, labeled as `old_favorite`.

**Event payload**:

```json
{
  "old_favorite": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "documentMetadataId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "favorite": {
    "id": "ID",
    "_owner": "ID",
    "userId": "ID",
    "documentMetadataId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent favorite-deleted

**Event topic**: `lcads-collectionmanagement-service-dbevent-favorite-deleted`

This event announces the deletion of a `favorite` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "documentMetadataId": "ID",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent curationHistory-created

**Event topic**: `lcads-collectionmanagement-service-dbevent-curationhistory-created`

This event is triggered upon the creation of a `curationHistory` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "collectionDocumentId": "ID",
  "actorUserId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "actionTimestamp": "Date",
  "reason": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent curationHistory-updated

**Event topic**: `lcads-collectionmanagement-service-dbevent-curationhistory-updated`

Activation of this event follows the update of a `curationHistory` data object. The payload contains the updated information under the `curationHistory` attribute, along with the original data prior to update, labeled as `old_curationHistory`.

**Event payload**:

```json
{
  "old_curationHistory": {
    "id": "ID",
    "_owner": "ID",
    "collectionId": "ID",
    "collectionDocumentId": "ID",
    "actorUserId": "ID",
    "actionType": "Enum",
    "actionType_": "String",
    "actionTimestamp": "Date",
    "reason": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "curationHistory": {
    "id": "ID",
    "_owner": "ID",
    "collectionId": "ID",
    "collectionDocumentId": "ID",
    "actorUserId": "ID",
    "actionType": "Enum",
    "actionType_": "String",
    "actionTimestamp": "Date",
    "reason": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent curationHistory-deleted

**Event topic**: `lcads-collectionmanagement-service-dbevent-curationhistory-deleted`

This event announces the deletion of a `curationHistory` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "collectionDocumentId": "ID",
  "actorUserId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "actionTimestamp": "Date",
  "reason": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `CollectionManagement` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event collection-created

**Event topic**: `elastic-index-lcads_collection-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "description": "Text",
  "type": "Enum",
  "type_": "String",
  "themeTags": "String",
  "institution": "String",
  "visibility": "Enum",
  "visibility_": "String",
  "ownerUserId": "ID",
  "curatorUserIds": "ID",
  "auditNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event collection-updated

**Event topic**: `elastic-index-lcads_collection-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "description": "Text",
  "type": "Enum",
  "type_": "String",
  "themeTags": "String",
  "institution": "String",
  "visibility": "Enum",
  "visibility_": "String",
  "ownerUserId": "ID",
  "curatorUserIds": "ID",
  "auditNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event collection-deleted

**Event topic**: `elastic-index-lcads_collection-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "title": "String",
  "description": "Text",
  "type": "Enum",
  "type_": "String",
  "themeTags": "String",
  "institution": "String",
  "visibility": "Enum",
  "visibility_": "String",
  "ownerUserId": "ID",
  "curatorUserIds": "ID",
  "auditNotes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event collection-extended

**Event topic**: `elastic-index-lcads_collection-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event collectiondocument-created

**Event topic**: `elastic-index-lcads_collectiondocument-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "documentMetadataId": "ID",
  "assignedByUserId": "ID",
  "notes": "Text",
  "orderInCollection": "Integer",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event collectiondocument-updated

**Event topic**: `elastic-index-lcads_collectiondocument-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "documentMetadataId": "ID",
  "assignedByUserId": "ID",
  "notes": "Text",
  "orderInCollection": "Integer",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event collectiondocument-deleted

**Event topic**: `elastic-index-lcads_collectiondocument-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "documentMetadataId": "ID",
  "assignedByUserId": "ID",
  "notes": "Text",
  "orderInCollection": "Integer",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event collectiondocument-extended

**Event topic**: `elastic-index-lcads_collectiondocument-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event favorite-created

**Event topic**: `elastic-index-lcads_favorite-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "documentMetadataId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event favorite-updated

**Event topic**: `elastic-index-lcads_favorite-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "documentMetadataId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event favorite-deleted

**Event topic**: `elastic-index-lcads_favorite-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "userId": "ID",
  "documentMetadataId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event favorite-extended

**Event topic**: `elastic-index-lcads_favorite-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event curationhistory-created

**Event topic**: `elastic-index-lcads_curationhistory-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "collectionDocumentId": "ID",
  "actorUserId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "actionTimestamp": "Date",
  "reason": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event curationhistory-updated

**Event topic**: `elastic-index-lcads_curationhistory-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "collectionDocumentId": "ID",
  "actorUserId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "actionTimestamp": "Date",
  "reason": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event curationhistory-deleted

**Event topic**: `elastic-index-lcads_curationhistory-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "collectionId": "ID",
  "collectionDocumentId": "ID",
  "actorUserId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "actionTimestamp": "Date",
  "reason": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event curationhistory-extended

**Event topic**: `elastic-index-lcads_curationhistory-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
