import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage, getBytes, deleteObject } from "firebase/storage";
import { config } from "@/app/lib/config";
import { IFirebaseGateway } from "../../domain/@shared/gateway/firebase.gateway.interface";
import { singleton } from "@/app/lib/util/singleton";


class FirebaseGateway implements IFirebaseGateway {
  private _app: FirebaseApp
  private _storage: FirebaseStorage

  constructor() {
    this._app = initializeApp(config.FIREBASE_CONFIG);
    this._storage = getStorage(this._app);
  }

  async uploadFile(input: File, bucket: string): Promise<{ url: string, bucket: string, name: string }> {
    const { name, type } = input

    const _name = name.replace(/ /g, "") //replace(/[^a-zA-Z0-9]/g, "")

    const _bucket = `${bucket}/${_name}`

    const fileRef = ref(this._storage, _bucket);

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

  async downloadFile(input: { name: string, bucket: string }) {
    const { name, bucket } = input
    const fileRef = ref(this._storage, `${bucket}/${name}`);
    return await getBytes(fileRef)
  }

  async deleteFile(input: { name: string, bucket: string }): Promise<void> {
    const { name, bucket } = input
    const _bucket = `${bucket}/${name}`
    const fileRef = ref(this._storage, _bucket);
    await deleteObject(fileRef)
  }


}

export const firebaseGateway = singleton(FirebaseGateway)
