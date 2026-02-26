import { db } from "../config/firebase";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";

export abstract class BaseRepository<T extends Record<string, any>> {
  protected collection: CollectionReference<DocumentData>;

  constructor(collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async create(id: string, data: T): Promise<void> {
    await this.collection.doc(id).set(data);
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async findOneByField(field: string, value: any): Promise<T | null> {
    const snapshot = await this.collection
      .where(field, "==", value)
      .limit(1)
      .get();

    return snapshot.empty ? null : (snapshot.docs[0].data() as T);
  }
}
