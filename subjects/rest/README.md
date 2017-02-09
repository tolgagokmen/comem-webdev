# REST APIs Introduction

Requirements:

* [Google Chrome][chrome] (recommended, any browser with developer tools will do)
* [Postman][postman] (recommended, any tool that makes raw HTTP requests will do)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is a Web Service?](#what-is-a-web-service)
- [Big web services](#big-web-services)
  - [Web services standards overview](#web-services-standards-overview)
  - [Big web services](#big-web-services-1)
- [RESTful web services](#restful-web-services)
  - [Principles of a REST architecture](#principles-of-a-rest-architecture)
  - [References](#references)
  - [HTTP is a protocol for interacting with **resources**](#http-is-a-protocol-for-interacting-with-resources)
  - [What is a resource?](#what-is-a-resource)
  - [Resource vs. representation](#resource-vs-representation)
  - [HTTP provides the **content negotiation** mechanisms](#http-provides-the-content-negotiation-mechanisms)
  - [Languages, platforms, communities](#languages-platforms-communities)
- [Testing tools](#testing-tools)
- [CRUD](#crud)
  - [Create](#create)
  - [Read](#read)
  - [Update](#update)
  - [Delete](#delete)
  - [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## What is a Web Service?

<p class='center'><img src='images/network.jpg' width='70%' /></p>

**Clients** need access to **data** and **logic**.
How can they find each other, know what logic can be invoked, and talk to each other over the web?



## Big web services

<!-- slide-front-matter class: center, middle -->



### Remote procedure call (RPC) or remote method invocation (RMI)

TODO: Java RMI diagram



### Web services standards

<p class='center'><img src='images/web-services-standards-overview.gif' width='90%' /></p>



### Pros & cons

Many standards:

* Simple Object Access Protocol (SOAP)
* Web Services Description Language (WSDL)

<!-- slide-column 50 -->

**Benefits:**

* Very rich protocol stack:
  * support for security
  * transactions
  * reliable transfer

<!-- slide-column 50 -->

**Problems:**

* Very rich protocol stack:
  * complexity
  * verbosity
  * incompatibility issues
  * theoretical human readability



## RESTful web services

<!-- slide-front-matter class: center, middle -->



### What is a REST API?

* API means [Application Programming Interface][api].

  > A clearly defined method of communication to interact with your program/service.

* REST means [REpresentational State Transfer][rest].

  > An architectural style for building distributed computer systems on the Internet (i.e. it's a type of [Web Service][web-service]).

  > The World Wide Web is one example that exhibits the characteristics of a REST architecture.

???

* REST has been introduced in Roy Fielding’s Ph.D. thesis (Roy Fielding has been a contributor to the HTTP specification, to the apache server, to the apache community).



### Principles of a REST architecture

* The state of the application is captured in a set of **resources**
  * Users, photos, comments, tags, albums, etc.
* Resources are identified with a standard format (e.g. **URLs**)
* Every resource can have several **representations**
* There is one unique interface for interacting with resources: **HTTP**



### What is a web resource?

Something that can be uniquely identified on the web:

<!-- slide-column 50 -->

**Static files**

* An article published in the "24 heures" newspaper
* A person's resume

<!-- slide-column 50 -->

**Dynamic content**

* The collection of articles published in the sport section of the newspaper
* The list of grades of the student Jean Dupont

<!-- slide-container -->

<!-- slide-column 50 -->

**Intangible things**

* The current price of the Nestlé stock quote

<!-- slide-column 50 -->

**Physical objects**

* The vending machine in the school hallway



### [Uniform Resource Locator (URL)][url]

> "A reference to a **web resource** that specifies its **location** on a computer network and a **mechanism** for retrieving it."

* http://www.24heures.ch/vaud/2008/08/04/trente-etudiants-manifestent
* http://imdb.com/movies/best?page=3&pageSize=50&orderBy=title
* http://www.smart-machines.ch/customers/heig/machines/8272#order

The syntax of an URL is:

```
scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
```



### Resource vs. representation

* In REST, we use the HTTP protocol to support the exchange of data between a **client** and a **server**.
* What is exchanged is not the actual resource: it is a **representation** of the resource.
* The **same resource** could have:
  * An HTML representation
  * An XML representation
  * A PNG representation
  * A WAV representation



## [HyperText Transfer Protocol (HTTP)][http]

<!-- slide-front-matter class: center, middle -->

> "An [application protocol][osi-application] for distributed, collaborative,
  and [hypermedia][hypermedia] information systems.
  HTTP is the foundation of data communication for the World Wide Web."



### HTTP is a request-response protocol

When you visit the following page:

```
https://en.wikipedia.org/wiki/Film
```

Your browser makes an HTTP **request** and gets a **response**:

```http
GET /wiki/Film HTTP/1.1
Accept: text/html,*/*
Host: en.wikipedia.org
```

```http
HTTP/1.1 200 OK
Content-Length: 58330
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Film - Wikipedia</title>
  </head>
  <body>
    ...
  </body>
</html>
```



### Anatomy of an HTTP request

Get the third page of a movies list:

```http
GET /movies/best?page=3&pageSize=50&orderBy=title HTTP/1.1
Accept: text/html,*/*
Host: www.example.com
```

Register a new movie:

```http
POST /api/movies HTTP/1.1
Content-Type: application/json
Host: www.example.com

{
  "name": "The Matrix",
  "releaseYear": 1999
}
```

#### Request method

The first line of an HTTP request is the **request line**:

```
  `GET` /movies/best?page=3&pageSize=50&orderBy=title HTTP/1.1
```

The **request method** is the *desired action* to perform.

| Method | Purpose                               |
| :---   | :---                                  |
| GET    | Retrieve data                         |
| POST   | Create a new resource                 |
| PUT    | Replace an existing resource          |
| PATCH  | Partially modify an existing resource |
| DELETE | Delete a resource                     |

There are [more methods][http-methods].

#### Resource path

The second part of the request line is the **resource path**:

```
  GET `/movies/best`?page=3&pageSize=50&orderBy=title HTTP/1.1
```

It tells the server where to find the resource to perform the action on.

#### Query string

The **query string** is the third part of the request line:

```
  GET /movies/best`?page=3&pageSize=50&orderBy=title` HTTP/1.1
```

These are parameters given to the server, usually to *filter* the resource.
In this case:

* `page=3` - we want the third page.
* `pageSize=50` - we want pages of 50 movies.
* `orderBy=title` - we want the movies ordered by title.

#### Headers

After the request line, an HTTP request has one or more **headers**:

```http
GET /movies/best?page=3&pageSize=50&orderBy=title HTTP/1.1
*Accept: application/html,*/*
*Host: www.example.com
```

This allows the client to tell the server how to serve the request:

* `Accept: application/html,*/*` - I prefer HTML, but otherwise give me any format you have.
* `Host: www.example.com` - This is the domain I want the resource from.

There are many [headers][headers] that can be used in requests.

#### Request (or message) body

The **body** is data that the client can ask the server to do something with:

```http
POST /api/movies HTTP/1.1
Content-Type: application/json
Host: www.example.com

*{
*  "name": "The Matrix",
*  "releaseYear": 1999
*}
```

In this case:

* It's a `POST` request, so the server should create a new resource.
* The `Content-Type` header is `application/json`, so the server should interepret the body as a JSON payload.



### Anatomy of an HTTP response

An HTML page:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Film - Wikipedia</title>
  </head>
  ...
</html>
```

A resource we just created:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "xo349",
  "createdAt": "2017-02-08T11:05:40+01:00",
  "name": "The Matrix",
  "releaseYear": 1999
}
```

#### Status code and reason phrase

The first line of an HTTP response is the **status line**:

```
  HTTP/1.1 `201 Created`
```

The **status code** and the **reason phrase** indicate to the client whether the request was successful and how to handle it:

| Code | Reason               | Purpose                                                                                                                                 |
| :--- | :---                 | :---                                                                                                                                    |
| 200  | OK                   | The response body contains the requested resource.                                                                                      |
| 201  | Created              | The `Location` header contains the URL of the created resource; the response body may contain a representation of the created resource. |
| 401  | Unauthorized         | Authentication is required and was not provided or is invalid.                                                                          |
| 422  | Unprocessable Entity | The request body is semantically invalid.                                                                                               |

There are many [status codes][http-status-codes] a server can use to help the client handle responses.

#### Headers

Like requests, an HTTP response has one or more **headers** after the status line:

```http
HTTP/1.1 200 OK
*Content-Language: en
*Content-Type: application/json
*Last-Modified: Tue, 07 Feb 2017 02:12:22 GMT

{
  "id": "xo349",
  "name": "The Matrix",
  "releaseYear": 1999
}
```

It allows the server to give the client additional metadata about the response:

* `Content-Language: en` - The response contains information in English.
* `Content-Type: application/json` - The response body is a JSON payload.
* `Last-Modified: Tue, 07 Feb 2017 02:12:22 GMT` - The resource was last modified on February 7th.

There are many [headers][headers] that can be used in responses.

#### Response (or message) body

The response body is the (optional) data sent by the server.
Its nature depends on what the request was and what the response status code indicates.
It could be the requested resource for a `GET` request:

```http
HTTP/1.1 200 OK
Content-Language: en
Content-Type: application/json

*{
*  "id": "xo349",
*  "name": "The Matrix",
*  "releaseYear": 1999
*}
```

Or it could be a list of errors if the body of a `POST` request was invalid:

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

*[
*  { "field": "name", "message": "Name is required" },
*  { "field": "releaseYear", "message": "Release year must be >= 1890" }
*]
```



### HTTP provides the [content negotiation][http-content-negotiation] mechanisms

Different **representations** of a resource can be exchanged at the **same URL**:

<!-- slide-column 50 -->

A JSON representation:

```http
GET /shows/game-of-thrones HTTP/1.1
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "title": "Game of Thrones",
  "releaseYear": 2011,
  "seasons": 6,
  "episodes": 60
}
```

<!-- slide-column 50 -->

An HTML representation:

```http
GET /shows/game-of-thrones HTTP/1.1
Accept: text/html,*/*
```

```http
HTTP/1.1 200 OK
Content-Type: text/html

<html>
  <head>
    <title>Game of Thrones</title>
  </head>
  <body>
    <h1>Game of Thrones</h1>
    <p>A 2011 TV show.</p>
    <ul>
      <li>6 seasons</li>
      <li>60 episodes</li>
    </ul>
  </body>
</html>
```



## [Create, read, update, delete (CRUD)][crud]

Since REST deals primarily with **resources**, in a REST API you will (mostly):

* **C**reate new resources
* **R**ead (or retrieve) a resource or collection of resources
* **U**pdate resources
* **D**elete (or detroy) resources



### Create

```http
POST /people HTTP/1.1
Content-type: application/json

{
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "age": 24
}
```

```http
HTTP/1.1 201 Created
Content-type: application/json

{
  "_id": "3orv8nrg",
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "age": 24
}
```

The POST method is used to request that the origin server accept the entity enclosed in the request as a new subordinate of the resource identified by the Request URI.

HTTP 201 Created: The request has been fulfilled and resulted in a new resource being created.



### Read

```http
GET /people HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-type: application/json

[
  { "_id": "3orv8nrg", … },
  { "_id": "a08un2fj", … }
]
```

The GET method means retrieve whatever information (in the form of an entity) is identified by the Request URI.

HTTP 200 OK: Standard response for successful HTTP requests. In a GET request, the response will contain an entity corresponding to the requested resource.

#### Collection resource vs. single resource

```http
GET /people/3orv8nrg HTTP/1.1
```

```http
HTTP/1.1 200 OK
Content-type: application/json

{
  "_id": "3orv8nrg",
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "age": 24
}
```



### Update

```http
PUT /people/3orv8nrg HTTP/1.1
Content-type: application/json

{
  "name": {
    "first": "John",
    "last": "Smith"
  },
  "age": 34
}
```

```http
HTTP/1.1 200 OK
Content-type: application/json

{
  "_id": "3orv8nrg",
  "name": {
    "first": "John",
    "last": "Smith"
  },
  "age": 34
}
```

The PUT method requests that the enclosed entity be stored under the supplied Request URI. If the Request URI refers to an already existing resource, the enclosed entity SHOULD be considered as a modified version of the one residing on the origin server.

HTTP 200 OK: In a PUT request, the response will contain an entity describing or containing the result of the action.

#### Partial updates with PATCH

TODO: partial update with PATCH example



### Delete

```http
DELETE /people/3orv8nrg HTTP/1.1
```

```http
HTTP/1.1 204 No Content
Content-type: application/json
```

The DELETE method requests that the origin server delete the resource identified by the Request URI.

HTTP 204 No Content: The server successfully processed the request, but is not returning any content.



### CRUD summary

TODO: table of HTTP method vs. operation on resource/collection



## Resources

TODO: HTTP request methods link

TODO: HTTP status codes link

* Very good article, with presentation of key concepts and illustrative examples:
  http://www.infoq.com/articles/rest-introduction
* Suggestions for the design of “pragmatic APIs”
  http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api



[api]: https://en.wikipedia.org/wiki/Application_programming_interface
[chrome]: https://www.google.com/chrome/
[crud]: https://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[http]: https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
[headers]: https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields
[http-content-negotiation]: https://en.wikipedia.org/wiki/Content_negotiation
[http-methods]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
[http-status-codes]: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#1xx_Informational
[hypermedia]: https://en.wikipedia.org/wiki/Hypermedia
[osi-application]: https://en.wikipedia.org/wiki/Application_layer
[postman]: https://www.getpostman.com
[rest]: https://en.wikipedia.org/wiki/Representational_state_transfer
[url]: https://en.wikipedia.org/wiki/Uniform_Resource_Locator
[web-service]: https://en.wikipedia.org/wiki/Web_service