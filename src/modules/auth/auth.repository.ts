import { db } from "../../config/firebase";

export class AuthRepository {
  private collection = db.collection("users");

  async findByEmail(email: string) {
    const snapshot = await this.collection
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
}
