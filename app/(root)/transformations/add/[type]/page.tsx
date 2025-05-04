import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById, createUser } from '@/lib/actions/user.actions';
import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if(!userId) redirect('/sign-in')

  let user = await getUserById(userId);

  if (!user) {
    // If user doesn't exist in MongoDB, create them with Clerk data
    const clerkUser = await currentUser();
    
    user = await createUser({
      clerkId: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || "",
      username: clerkUser?.username || "",
      photo: clerkUser?.imageUrl || "",
      firstName: clerkUser?.firstName || "",
      lastName: clerkUser?.lastName || "",
      planId: 1,
      creditBalance: 10
    });
  }

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage