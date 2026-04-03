import multer from "multer";
import sharp from "sharp";
import path from "path";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
dotenv.config();

// AWS S3 Client
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }
});

// Function to upload a single file to S3
export const uploadFile = async (file) => {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.originalname).toLowerCase();

  // If image, optionally convert
  let buffer = file.buffer;
  let contentType = file.mimetype;

  if (file.mimetype.startsWith("image/")) {
    const shouldConvert = ext === ".jfif" || file.mimetype === "application/octet-stream";
    if (shouldConvert) {
      buffer = await sharp(file.buffer).jpeg().toBuffer();
      contentType = "image/jpeg";
    }
  }

  // Generate key - remove spaces from filename
  const cleanFileName = file.originalname.replace(/\s+/g, '_');
  const fileName = `${Date.now()}_${cleanFileName}`;
  const key = `uploads/${fileName}`;

  // Upload with public read access
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType
  }));

  return {
    url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
    key
  };
};

export const uploadPDF = async (file, folder = "uploads") => {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // Clean file name: replace spaces with underscores
  const cleanName = file.originalname.replace(/\s+/g, "_");

  // Use timestamp + cleaned name for uniqueness
  const timestamp = Date.now();
  const fileName = `${timestamp}-${cleanName}`;
  const key = `${folder}/${fileName}`;

  // Upload PDF to S3
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: "application/pdf"
    })
  );

  return {
    url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
    key,
  };
};

export const deleteFileFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) return;

    const key = fileUrl.split(".amazonaws.com/")[1];
    if (!key) return;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err) {
    console.error("❌ Error deleting from S3:", err.message);
  }
};

export const deleteManyFromS3 = async (keys = []) => {
  try {
    if (!keys.length) return;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: keys.map(key => ({ Key: key }))
      }
    };

    const result = await s3.send(new DeleteObjectsCommand(params));
    return result;
  } catch (error) {
    console.error("❌ S3 deleteMany Error:", error.message);
    throw error;
  }
};

export const listBucketObjects = async () => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME
    };

    const data = await s3.send(new ListObjectsV2Command(params));

    const region = process.env.S3_REGION;
    const bucket = process.env.S3_BUCKET_NAME;

    const files = (data.Contents || []).map(file => {
      const url = `https://${bucket}.s3.${region}.amazonaws.com/${file.Key}`;
      return {
        key: file.Key,
        url,
        size: file.Size,
        lastModified: file.LastModified
      };
    });

    return files;
  } catch (error) {
    console.error("❌ S3 listBucketObjects Error:", error.message);
    throw error;
  }
};