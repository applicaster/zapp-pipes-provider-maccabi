# zapp-pipes-provider-starter-kit
A starter project for development of data source provider

In order to create a new provider, it is advised to start from the starter project in order to make sure the provider respects the Zapp-pipes api, and can be smoothly integrated.

A Provider consists of an npm package published privately in the applicaster npmjs repository. Contact us on slack if you need more information about npmjs private packages.

### Provider Api

The final export of the provider npm package must be an object with the following properties : 

* **name<String>**: name of the provider. this string will be used as the scheme for making requests inside the app, and should only contain UTF-8 compatible alphabetical characters and dashes `-`
* **manifest**: the manifest is an object containing the following properties :
  * **handlers<[String]>**: strings of `request_type` handled by the provider. All request must contain a `type` parameter which matches one of the handlers declared here. If a request is made to an unregistered `request_type`, the zapp-pipes bundle will throw an error.
  * **help&lt;Object&gt;**: the help object is supposed to provide help for all supported `request_type`. Ideally, should provide a description object, and a parameters array which declares all the other parameters required for performing the relevant `request_type`
* **handler: (providerUtils) -> (params) -> providerResult&lt;Promise:Any&gt;** : the handler method should be a curried function which returns the result of the request. The currying enables the core library to inject the parameters and the utility functions the provider may require. 
* **test&lt;Object&gt;**: The test object provides the info required by the packager to run integration tests while building the bundle
  * **testCommand<String>**: the test command that will be used in the integration test. should be something like `{provider-name}://fetchData?type={requestType}&foo=bar`
  * **requestMocks&lt;[Object]&gt;**: the zapp-pipes packager uses [nock](https://github.com/node-nock/nock) to mock server request during the integration test process. The `requestMocks` object allows to register urls and responses that need to be mocked during the integration test. For each mocked request, you should provide an object with the following properties:
    * **host&lt;String&gt;** : the full host name, with the protocol used
    * **method<get|post>** : the http method to use. If using `post`, the nock setup will automatically intercept requests, regardless of the payload sent in the request body
    * **path&lt;String&gt;** : the path of the request, which must start with `/`
    * **httpCode&lt;Number&gt;** : the httpCode of the response, default is `200`
    * **expectedResponse&lt;Object&gt;** : the response nock will return for the request. It is *not* the response expected from the library, but just the request call.

Here is an example of a provider implementation
```javascript
  const provider = {
    name: 'my-provider-name',

    manifest: {
        handlers: ['collection', 'item'],
        help: { 
            collection: {
                description: 'list of items',
                params: { ... }
            ....
            }
       }
    },

    test: {
      testCommand: 'my-provider-name://fetchData?type=allFeeds&id=XXX',
      requestMocks: [{
        host: 'http://api.my-server.com',
        method: 'get',
        path: '/feeds/id/XXX',
        httpCode: 200, // unecessary here cause it will default to 200
        expectedResponse: {}, // full expected response from a get request to http://api.my-server.com/feeds/id/XXX
      }, {
        host: 'https://auth.my-server.com',
        method: 'post',
        path: '/token',
        httpCode: 200,
        expectedResponse: { token: 'XXXX' },
      }],
    },

    handler: providerInterface => params => {

      const { type } = params;

      if (!checkParams(params)) {
        return providerInterface.throwError({ msg: 'invalid params', params });
      }

      if (type === 'collection') {
        return collectionRequest(params)
          .catch(error => providerInterface.throwError({ error, params }))
          .then(response => providerInterface.sendResponse(response));
      }
    }
  };

  export default provider;
```

The `providerInterface` object is a toolbelt object which provides the following methods :
* `log(...msg)`: logs a message
* `throwError(reason)`: will return a 402 bad request response, with a reason message
* `sendResponse(response, code = 200)`: will return a response to the router, with the given http code (default is 200)
* appData() : function which returns data from the native app. returns an object containing the device uuid, the bundle indentifier, and other app / device related data.

the handler has to explicitly return the response using either the `sendResponse()` or `throwError()` method of the providerInterface. Invoking a callback with a request response will break the flow of the bundle, and if the handler doesn't return anything, the bundle might hang or throw.

## Tests

It is better if the provider has tests, but there is no strict enforcement of this. However, integration tests are ran.
This tests rely on the test property of the provider, and bundling will fail if this property is not correctly set according to the documentation above.

Integration test don't test the provider's internal work fully. They just make sure that the provider returns something - even an error.

## Data output

All providers must return either a feed or an entry according to the following format : 
```javascript
const feed = {
  title: '', // title of the feed
  author: { name: 'author name' },
  id: '', // 'id of the feed'
  summary: '', // description of the feed
  link: {
    type: 'atom',
    rel: 'self',
    href: '', // url to get the feed
  },
  type: {
    value: '' // either feed, or the entry type
  },
  mediaGroup: [{
    type: '', // type of media asset : thumbnail...
    media_item: {
      scale: 'small|large',
      src: '', // url of the media asset
    }
  }] // mediaGroup can contain any number of assets
  updated: '' // ISO 8601 timestamp of the latest feed update*,
  entry: [] // array of feed entries
  extensions: {}, // all other data you want to pass
};

const entry = {
  id: '',
  title: '',
  summary: '',
  author: { name: '' },
  type: { value: 'feed|video|article|channel|gallery' },
  link: {
    type: 'atom',
    rel: 'self',
    href: '', // url to get the entry
  },
  ui_tag: '', // may be required in some cases
  screen_type: '', // may be required in some cases
  mediaGroup: [{}], // same as above,
  updated: '',
  extensions: {},
}
```

* https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations

## npm commands

The starter kit is pre-configured to pull the `zapp-pipes-dev-kit` and expose a node server to test the provider in the browser. just run `npm start` to kick off the server, and point your browser to `http://localhost:8080/{provider-name}/fetchData?type={request_type}&params=...`

There are also `pretest` and `prepublish` hooks prepared for testing and releasing the bundle. The `pretest` hook should not be removed, as the `zapp-pipes packager` will need to pull all dependencies - including test dependencies in order to run the provider's test suite.
