import { db } from "../config/firebase";
import {
  CollectionReference,
  DocumentData,
  Query,
} from "firebase-admin/firestore";

export abstract class BaseRepository<T extends { id: string }> {
  protected collection: CollectionReference<DocumentData>;

  constructor(collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const docRef = this.collection.doc();
    const now = new Date().toISOString();

    const newData = {
      id: docRef.id,
      ...data,
    } as T;

    await docRef.set(newData);
    return newData;
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async findOne(field: string, value: any): Promise<T | null> {
    const snapshot = await this.collection
      .where(field, "==", value)
      .limit(1)
      .get();

    return snapshot.empty ? null : (snapshot.docs[0].data() as T);
  }

  async findMany(
    conditions?: Array<{ field: string; operator: any; value: any }>,
  ): Promise<T[]> {
    let query: Query = this.collection;

    if (conditions) {
      conditions.forEach((cond) => {
        query = query.where(cond.field, cond.operator, cond.value);
      });
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  async findWithCursor(options: {
    limit: number;
    cursor?: string | null;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    conditions?: Array<{ field: string; operator: any; value: any }>;
  }): Promise<{
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const {
      limit = 10,
      cursor = null,
      orderBy = "createdAt",
      orderDirection = "desc",
      conditions = [],
    } = options;

    let query: Query = this.collection;

    conditions.forEach((cond) => {
      query = query.where(cond.field, cond.operator, cond.value);
    });

    query = query.orderBy(orderBy, orderDirection);
    query = query.orderBy("id", "asc");

    if (cursor) {
      const cursorDoc = await this.collection.doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.limit(limit + 1).get();

    const hasMore = snapshot.docs.length > limit;
    const docs = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs;

    const data = docs.map((doc) => doc.data() as T);
    const nextCursor = hasMore ? docs[docs.length - 1].id : null;

    return { data, nextCursor, hasMore };
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const docRef = this.collection.doc(id);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);

    const updated = await docRef.get();
    return updated.exists ? (updated.data() as T) : null;
  }

  async delete(id: string): Promise<boolean> {
    await this.collection.doc(id).delete();
    return true;
  }

  async exists(field: string, value: any): Promise<boolean> {
    const snapshot = await this.collection
      .where(field, "==", value)
      .limit(1)
      .get();

    return !snapshot.empty;
  }
}
