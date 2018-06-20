const Hapi = require('hapi');
const Boom = require('boom');
const Inert = require('inert');
const uploader = require('./lib/uploader');

const port = process.env.PORT || 3000;
const publicDir = './public';
const publicUploadPath = `/uploads`;
const uploadDir = `${publicDir}/${publicUploadPath}`;
const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE || 5; // in mb

const server = new Hapi.Server({ port });

const provision = async () => {

  await server.register(Inert);

  await server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: publicDir,
        redirectToSlash: true,
        index: true,
      }
    }
  });

  await server.route({
    method: 'POST',
    path: '/api/upload',
    config: {
      payload: {
        output: 'stream',
        allow: 'multipart/form-data',
        maxBytes: MAX_UPLOAD_SIZE * 1048576
      }
    },
    handler: async (request, h) => {
      try {
        const data = request.payload;
        const file = data['image'];
        const fileOptions = { uploadDir, publicUploadPath };

        // save the file
        const { publicPath, originalName } = await uploader(file, fileOptions);

        // return result
        return { publicPath, originalName };

      } catch (err) {
        return Boom.badRequest(err.message, err);
      }
    }
  });

  await server.start();

  console.log('Server running at:', server.info.uri);
};

provision();