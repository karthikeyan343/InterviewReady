import supabase from "../config/supabase.js";

/**
 * Pings Supabase Storage to keep the project active and verify connectivity.
 * Returns true if active, false otherwise.
 */
export const pingSupabase = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.listBuckets();

    if (error) {
      console.warn(
        `[Supabase Keep-Alive] Project response error (may be paused or credentials invalid): ${error.message}`
      );
      return false;
    }

    return true;
  } catch (err) {
    console.warn(
      `[Supabase Keep-Alive] Ping failed:`,
      err instanceof Error ? err.message : err
    );
    return false;
  }
};

/**
 * Starts a recurring background heartbeat to ensure Supabase remains active.
 * Supabase free tier pauses after 7 days of inactivity; this runs every 48 hours.
 */
export const initSupabaseKeepAlive = (): void => {
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

  // Run initial verification on server startup
  void pingSupabase().then((isActive) => {
    if (isActive) {
      console.log("[Supabase Keep-Alive] Initial connection established. Heartbeat active.");
    } else {
      console.warn(
        "[Supabase Keep-Alive] Initial ping did not succeed. If the project is paused, please unpause it from https://supabase.com/dashboard"
      );
    }
  });

  // Recurring keep-alive every 48 hours
  const interval = setInterval(async () => {
    const isActive = await pingSupabase();
    if (isActive) {
      console.log(`[Supabase Keep-Alive] Heartbeat ping successful at ${new Date().toISOString()}`);
    }
  }, FORTY_EIGHT_HOURS_MS);

  // Unref so the interval doesn't prevent Node from exiting on graceful shutdown
  if (interval.unref) {
    interval.unref();
  }
};

