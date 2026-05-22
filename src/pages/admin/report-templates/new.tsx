import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NewTemplate() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/report-templates/designer");
  }, [router]);

  return null;
}
