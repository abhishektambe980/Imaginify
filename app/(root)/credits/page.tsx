import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Header from "@/components/shared/Header";
import { getUserById } from "@/lib/actions/user.actions";
import CreditPlans from "@/components/shared/CreditPlans";

const Credits = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section className="mt-8">
        <CreditPlans userId={userId} user={user} />
      </section>
    </>
  );
};

export default Credits;
