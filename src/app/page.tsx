import { getSettings } from "../lib/store";
import MirrorLayout from "../components/MirrorLayout";

export default async function Home() {
  // Fetch initial settings server-side to avoid hydration flicker/errors
  const initialSettings = await getSettings();

  return (
    <MirrorLayout initialSettings={initialSettings as any} />
  );
}
