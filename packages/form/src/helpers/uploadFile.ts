/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { env } from "@/env";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
export const uploadFile = async (files: FileList) => {
  // S3 Bucket Name
  const S3_BUCKET = env.NEXT_PUBLIC_AWS_S3_BUCKET;

  // S3 Region
  const REGION = env.NEXT_PUBLIC_AWS_REGION;

  // S3 Credentials
  AWS.config.update({
    accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  // Files Parameters
  const params = Array.from(files).map((f) => ({
    Bucket: S3_BUCKET,
    Key: `song-bank-${f?.name.split(".")[0]}-${uuidv4()}.${f?.name.split(
      ".",
    )[1]}`,
    Body: f,
  }));

  // Uploading file to s3

  const uploadPromises = params.map((p) =>
    s3
      .putObject(p)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(evt.loaded);
      })
      .promise(),
  );
  const upload = Promise.all(uploadPromises);

  await upload
    .then(() => {
      console.log("File uploaded successfully to S3.");
    })
    .catch((err) => {
      console.error(err);
      alert("Server Error");
    });
  return params.map((p) => p.Key) || "";
};
