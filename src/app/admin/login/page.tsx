import { redirect } from "next/navigation";
import { isAdminConfigured, isAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <div className="container-x max-w-md pb-24">
      <p className="label-mono">Restricted</p>
      <h1 className="mt-3 text-4xl font-bold uppercase text-white">Admin sign in</h1>
      {configured ? (
        <LoginForm />
      ) : (
        <div role="alert" className="mt-8 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5 text-sm leading-relaxed text-amber-100">
          Administrator access is not configured on this deployment. Set <code>ADMIN_EMAIL</code>,{" "}
          <code>ADMIN_PASSWORD_HASH</code>, and <code>APP_SECRET</code> in the server environment (see README).
        </div>
      )}
    </div>
  );
}
