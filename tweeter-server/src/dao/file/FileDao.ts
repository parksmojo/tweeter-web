export interface FileDao {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
