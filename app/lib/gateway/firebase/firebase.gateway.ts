import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage, getBytes } from "firebase/storage";
import { config } from "@/app/config";

export class FirebaseGateway {
  private _app: FirebaseApp
  private _storage: FirebaseStorage

  constructor() {
    this._app = initializeApp(config.FIREBASE_CONFIG);
    this._storage = getStorage(this._app);
  }

  async uploadFile(input: File): Promise<{ url: string, bucket: string, name: string }> {
    const { name, type } = input

    const _name = name.replace(/ /g, "") //replace(/[^a-zA-Z0-9]/g, "")

    const bucket = `bota/upload-files/${_name}`

    const fileRef = ref(this._storage, bucket);

    const fileUrl = await uploadBytes(
      fileRef,
      input,
      { contentType: type }
    ).then(
      async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref).then((url) => url);
        return url;
      }
    );

    return {
      url: fileUrl,
      bucket,
      name: _name
    };
  };

  async downloadFile(input: { name: string }) {
    const { name } = input
    const fileRef = ref(this._storage, `bota/upload-files/${name}`);
    return await getBytes(fileRef)
  }
}
