# SimpleGoogleAuthWrapper

A simple class to easily plug google auth into Passport, simply by providing a persistance delegate, and config file.

Supports things like whitelisting and blacklisting, and simple route configuration through an external json config file.

Ideally, you shouldn't need to touch the main class, simply create your delegate with your persistance of choice and write the config file.

You can find examples of the persistance delegate in the Examples folder.
