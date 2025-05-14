import { useRouter } from "next/router";
import { useEffect } from "react";
import MedicineDetailPageNew from "./[id]_new";

export default function NewMedicinePage() {
  const router = useRouter();

  useEffect(() => {
    // This is needed to ensure that the [id]_new.tsx component
    // knows we're in "new" mode
    router.query.id = "new";
  }, [router]);

  return <MedicineDetailPageNew />;
}
