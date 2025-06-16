import { MongoClient } from "mongodb";

if (!process.env.MONGODB_BCUBE_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_BCUBE_URI"');
}

const uri = process.env.MONGODB_BCUBE_URI;
const options = {};

let client;
let bCubeClientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _bCubeClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._bCubeClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._bCubeClientPromise = client.connect();
  }
  bCubeClientPromise = globalWithMongo._bCubeClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  bCubeClientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { bCubeClientPromise };
