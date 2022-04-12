# How to create your own widget in FLOWFACT

You can create your own Widgets by using or extending our example React application.

It works by communicating via the postmessage api of iframes between the platform-apps (Host) and your client application (aka Widget).

If the Widget should display or receive any data from platform-apps or communicate with our APIs directly, it needs to communicate with the Host. For that we use the `post-robot` library. It is not required that you use React, you could use any framework with it.


## Module Keys
Every Widget you create needs a unique module key. We prepared a constant for you `__MODULE_KEY__` which will hold the module key of your widget. It is used when you integrated the widget in your application, so the platform knows how to communicate with it.

## Development
You can start up the example application with `yarn dev` which will start a react dev server on `http://localhost:3003`. (configure as you like for your needs in `package.json`)

The example provided demonstrates the use-case of connecting via post-robot to the host.

1. your widget registers a message handler for `initial_{__MODULE_KEY__}`. This message will be send by the hosting platform so your widget itself can log in and receive the necessary tokens to authenticate against the API.

2. your application needs to register a message handler for `data_{__MODULE_KEY__}`. This will be called when your widget is ready to receive data from the platform. This will most likely contain the data of an entity where the widget is used.

3. after you received the `initial_` message, you will try to log in (see example) and after that **you need to SEND back** to the hosting application a `ready_{__MODULE_KEY__}` message, so the host knows the widget is ready to receive data.

For that to work, you need to integrate the Widget in your platform-apps context by going to the location of the application where you want to use the widget and integrate it there. For example, our Example Widget requires to be used in the context of an Estate Entity.

## Integration

You integrate the Widget in your app by using the `Framed Widget` from our Widget store, where you will provide the URL of the running widget and a unique Module Key (see below). Example Framed Widget Settigs:

- URL: http://localhost:3003
- Module Key: YOUR_UNIQUE_KEY_FOR_THIS_MODULE

## Publishing

For production usage, the Widget needs to be compiled and running on a custom host / server with it's own domain and/or port. It needs to use and support the post-robot library and have registered the necessary message handlers.

Make sure the Module Key is unique.
