import UserProfileForm from '~/components/UserProfileForm';

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">User Profile</h1>
      <UserProfileForm />
    </div>
  );
}