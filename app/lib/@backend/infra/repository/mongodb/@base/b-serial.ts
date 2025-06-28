import { MongoClient } from "mongodb";

if (!process.env.MONGODB_BSERIAL_URI) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_BSERIAL_URI"'
  );
}

const uri = process.env.MONGODB_BSERIAL_URI;
const options = {};

let client;
let bSerialClientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _bSerialClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._bSerialClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._bSerialClientPromise = client.connect();
  }
  bSerialClientPromise = globalWithMongo._bSerialClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  bSerialClientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { bSerialClientPromise };
