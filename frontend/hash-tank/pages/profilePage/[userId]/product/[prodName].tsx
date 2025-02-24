import PublicPage from "@/components/PublicPage";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const { userId, prodName } = router?.query;
  console.log("********************************")
  console.log(userId, prodName);

  if (!userId) {
    router.push('/');
  }

  return (
    <>
      <PublicPage userId={userId as string} prodName={prodName as string} />
    </>
  )
}