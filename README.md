# foodster

## Development

To run a docker instance of mongodb in a local machine go [here](https://www.code4it.dev/blog/run-mongodb-on-docker).

## Documentation

### Deployment
The server is published [here](https://foodster-cs491.herokuapp.com/), please query that base url with parameters you want depending on the functionality.

For now in the ```master``` branch of this repository auto-deployment is configured. Therefore, it is important that nothing
that is unstable should be pushed to the ```master```. The default branch of development called ```development```.
### Documenting code
Documentation of swagger that is used to write documentation can be found [here](https://swagger.io/docs/specification/basic-structure/)

To make the generation of documentation an npm library swagger-autogen is used, you can 
read further about it [here](https://github.com/davibaltar/swagger-autogen)

Once the comments for the swagger autogen are written, 
```
npm run autogen
```
needs to be run. Once that is done swagger_output.json will be filled with the documentation
you have added. Then, you can go to the ```base_url/docs``` link to find the documentation.
