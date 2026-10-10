import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Create account</h1>
      <RegisterForm />
    </>
  );
}
