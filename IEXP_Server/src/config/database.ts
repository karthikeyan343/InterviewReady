import mongoose from "mongoose";
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if custom dns servers cannot be set
}

const resolveSrvViaDoH = async (srvUri: string): Promise<string> => {
  const url = new URL(srvUri.replace("mongodb+srv://", "http://"));
  const hostname = url.hostname;
  const srvUrl = `https://dns.google/resolve?name=_mongodb._tcp.${hostname}&type=SRV`;
  const txtUrl = `https://dns.google/resolve?name=${hostname}&type=TXT`;

  const [dohRes, txtRes] = await Promise.all([
    fetch(srvUrl).then((r) => r.json()),
    fetch(txtUrl).then((r) => r.json()).catch(() => ({ Answer: [] })),
  ]);

  if (!dohRes.Answer || dohRes.Answer.length === 0) {
    throw new Error(`Could not resolve SRV records for ${hostname}`);
  }

  const hosts = dohRes.Answer.map((a: any) => {
    const parts = a.data.trim().split(/\s+/);
    const port = parts[2];
    const host = parts[3].replace(/\.$/, "");
    return `${host}:${port}`;
  }).join(",");

  let extraParams = "ssl=true&retryWrites=true&w=majority";
  if (txtRes.Answer && txtRes.Answer.length > 0) {
    const txt = txtRes.Answer[0].data.replace(/^"|"$/g, "");
    extraParams += `&${txt}`;
  }

  const auth = url.username && url.password ? `${url.username}:${url.password}@` : "";
  const database = url.pathname && url.pathname !== "/" ? url.pathname : "";

  return `mongodb://${auth}${hosts}${database}?${extraParams}`;
};

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGO_URI is not configured");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Atlas connected successfully");
  } catch (error: any) {
    if (
      mongoURI.startsWith("mongodb+srv://") &&
      error?.message &&
      error.message.includes("querySrv ECONNREFUSED")
    ) {
      console.warn(
        "[MongoDB] Local DNS refused SRV lookup (querySrv ECONNREFUSED). Falling back to DNS-over-HTTPS resolution..."
      );
      try {
        const directURI = await resolveSrvViaDoH(mongoURI);
        await mongoose.connect(directURI);
        console.log("MongoDB Atlas connected successfully via direct replica set fallback");
        return;
      } catch (fallbackError) {
        console.error("MongoDB connection fallback failed:", fallbackError);
      }
    }

    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;