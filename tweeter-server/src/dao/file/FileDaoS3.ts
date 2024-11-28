import { FileDao } from "./FileDao";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

export class FileDaoS3 implements FileDao {
  private readonly bucketName = "parker340bucket";
  private readonly region = "us-west-2";

  private client;

  constructor() {
    this.client = new S3Client({ region: this.region });
  }

  async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    // throw new Error("Method not yet implemented");
    let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64Encoded, "base64");
    const s3Params = {
      Bucket: this.bucketName,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const command = new PutObjectCommand(s3Params);
    try {
      await this.client.send(command);
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
