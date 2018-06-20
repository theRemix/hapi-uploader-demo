const fs = require('fs');
const { join } = require('path');
const uuid = require('uuid');

module.exports = (file, { uploadDir, publicUploadPath }) => {
  const originalName = file.hapi.filename;
  const filename = `${uuid.v1()}-${originalName}`;
  const path = join(uploadDir, filename);
  const publicPath = join(publicUploadPath, filename);
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on('error', err => {
      reject(err);
    });

    file.pipe(fileStream);

    file.on('end', err => {
      const fileDetails = {
        fieldname: file.hapi.name,
        originalName,
        filename,
        mimetype: file.hapi.headers['content-type'],
        destination: uploadDir,
        path,
        publicPath,
        size: fs.statSync(path).size,
      }

      resolve(fileDetails);
    })
  })
};

