import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let uploadFolder = './uploads'; // Default folder
      console.log('file n', file);
      if (file.fieldname === 'image') {
        uploadFolder = './uploads/images'; // Set the image upload folder
      } else if (file.fieldname === 'character') {
        uploadFolder = './uploads/characters'; // Set the document upload folder
      } else if (file.fieldname === 'news') {
        uploadFolder = './uploads/news';
      } else if (file.fieldname === 'commercialRegisterExtractFile') {
        uploadFolder = './uploads/commercial';
      }

      console.log('Destination folder:', uploadFolder);
      cb(null, uploadFolder); // Set the destination folder based on the file type
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      // Get the original file extension
      const fileExtension = path.extname(file.originalname);

      // Use the original extension in the filename
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
  }),
  // Enable debug mode
  debug: true,
};
