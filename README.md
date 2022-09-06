<h1 align="center">
  <br>
	<a href="https://github.com/Spicy-Sparks/Pantera"><img src="assets/Pantera.png" alt="pantera-logo" width="320px"></a>
  <br>
	<br>
    <a href="https://github.com/Spicy-Sparks/Pantera">Pantera</a><br>
	<br>
</h1>
<h4 align="center">
	An HTTP request client that provides an <a href="https://github.com/axios/axios>axios</a> like interface over top of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API>fetch</a>. Super lightweight. Supports interceptors and multiple instances.
</h4>

## Features

 - Make [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests with a simplified API
 - Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
 - Support multiple instances with default options
 - Intercept request and response
 - Automatic transforms for `JSON` and `blob` data
- Automatic data object serialization to `multipart/form-data`, `application/json` and `x-www-form-urlencoded` body encodings
- Automatic URL encoding with query string parameters
- Support to [basic auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) and [credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)

## Installing

Using npm:

`npm install pantera`

Using yarn:

`yarn add pantera`

## Basic usage

Creating a request

```js
pantera.request({
  method: 'get',
  url: 'https://myapplication.com/api/user',
  params: {
	   ID: 12345
  },
  responseType: 'json',
  headers: {
	   Authorization: 'Bearer myToken',
	   'Content-Type': 'application/json'
  }
})
.then(function (response) {
  // handle success
  const { data, config } = response
  console.log(data, config)
})
.catch(function (error) {
  // handle error
  const { response, config } = error
  console.log(error)
})
.then(function () {
  // always executed
})
```

Shortcuts for `GET`, `POST`, `PUT`, `PATCH`, `PUT`, `OPTIONS`, `DELETE` requests.

```js
import pantera from 'pantera'

pantera.get('https://myapplication.com/api/user', {
  params: {
    ID: 12345
  },
  responseType: 'json'
})

pantera.post('https://myapplication.com/api/form', {
  body: {
    formField: 'value'
  },
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
```

## Creating multiple instances

It is possible to create multiple instances for different situations or across multiple APIs. Each instance can have a common base URL that will be applied to all requests, default headers, a common responseType, a common extraConfig or a common authentication. In general, the specified default configuration will be added to each request.

```js
const simpleClient = new Pantera({
  baseUrl: 'https://myapplication.com/api',
  responseType: 'json'
})

const response = await simpleClient.request('/user', {
  method: 'get',
  params: {
  	ID: 1234
  }
})

// or
const response = await simpleClient.get('/user', {
  params: {
  	ID: 1234
  }
})

const complexClient = new Pantera({
  baseUrl: 'https://myapplication.com/api',
  responseType: 'json',
  credentials: true,
  auth: {
    username: 'myUsername',
    password: 'myPassword'
  },
  headers: {
    'Content-Type': 'application/json',
    'X-Common-Header': 'myValue',
    'Authorization': 'Bearer myToken'
  },
  extraConfig: {
    variableForInterceptors: 'complexApi'
  }
})

const response = await complexClient.request({
  url: '/user',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
```

## Using async/await

Pantera fully supports `async/await` syntax.

```js
try {
  const response = await pantera.get('https://myapplication.com/api/json-response', {
    responseType: 'json',
    params: {
	    myQueryStringParameter: 'value'
    }
  })
  // handle success
  const { data, config } = response
  console.log(data, config)
}
catch (error) {
  // handle error
  console.log(error)
}
```

## Response encoding

The response is automatically parsed into JSON, Blob or plain text, depending on the `responseType`.

```js
pantera.get('https://myapplication.com/api/json-response', {
  responseType: 'json'
})

pantera.get('https://myapplication.com/api/index.html', {
  responseType: 'text'
})

pantera.get('https://myapplication.com/api/myfile', {
  responseType: 'blob'
})
```

All your files and folders are presented as a tree in the file explorer. You can switch from one to another by clicking a file in the tree.

## Intercepting requests and responses

You can intercept requests or responses before they are handled by `then` or `catch`.

```js
const myClient = new Pantera({
  baseUrl: 'https://myapplication.com/api',
  responseType: 'json'
})

myClient.interceptors.request.use((config) => {
  // Do something before request is sent

  if(!config.headers)
    config.headers = {}

  config.headers.Authorization = 'Bearer myToken'
  return config
})

myClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { config, data } = response
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to 	trigger
    // Do something with response error

    if (err.status === 401) {
	    const refreshResponse = await refreshToken()
	    err.config.headers.Authorization = `Bearer ${refreshResponse.newToken}`
        return myClient.request(err.config)
    }

    return Promise.reject(error)
  }
)
```

## Multiple concurrent requests

Since Pantera is based on [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), you can send multiple requests that will be executed at the same time and read all their responses at the end using [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), or any other Promise API.

```js
Promise.all([
  pantera.get('https://myapplication.com/api/index.html', {
    responseType: 'text'
  })
])
.then(([ response1, response2 ]) => {
  // handle success
  const { data1, config1 } = response1
  console.log(data1, config1);
})
.catch((errors) => {
  // handle error
  console.log(errors)
})
```

## Support to auth and credentials

Pantera supports [basic auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) and [credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials).
`credentials` can be `include` (or `true`), `omit` (or `false`), `same-origin`.

```js
pantera.get('https://myapplication.com/api/json-response', {
  responseType: 'json',
  credentials: true,
  auth: {
    username: 'myUsername',
    password: 'myPassword'
  }
})
```

## Extra data for config

In case you need to get custom attributes in your interceptor or response, you can append it in `extraConfig`.

```
const myClient = new Pantera({
    baseUrl: 'https://myapplication.com/api'
})

myClient.interceptors.request.use((config) => {
  if(config.extraConfig?.myCustomAttribute) {
    console.log('Received myCustomAttribute')
  }
  return config
})

myClient.post('/form', {
  body: {
    formField: 'value'
  },
  extraConfig: {
    myCustomAttribute: true
  }
})
```

## Credits

Pantera is heavily inspired by [axios](https://github.com/axios/axios) and is built on top of the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API.
Pantera is developed and mantained by [Spicy Sparks](https://spicysparks.com) and widely used in [eSound Music](https://esound.app)

## License

[MIT](https://github.com/Spicy-Sparks/Pantera/blob/master/LICENSE)
