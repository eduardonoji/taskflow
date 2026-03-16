import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-2">

      {/* lado esquerdo */}
      <div className="flex items-center justify-center bg-blue-600 text-white p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            TaskFlow (0.1.0)
          </h1>

          <p className="text-lg opacity-90">
            Organize suas tarefas e aumente sua produtividade.
          </p>
        </div>
      </div>

      {/* lado direito */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

    </div>
  );
}