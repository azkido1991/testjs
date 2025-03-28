"use client";

import { forgotPassword } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const formSchema = z.object({
  email: z.string().email(),
});

type TFormSchema = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HCaptcha | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email") ?? ""),
    },
  });

  const handleFormSubmit = async (data: TFormSchema) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA");
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const response = await forgotPassword({ email: data.email });

      if (response.error) {
        setError(response.message);
      } else {
        toast.success(
          "We've sent a password reset link to your email address."
        );
        reset();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:max-w-smd mx-auto flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="w-full mb-4">
            <div className="input-group w-full">
              <span className="input-group-text">
                <span className="icon-[solar--mention-square-bold-duotone] text-base-content/80 size-5"></span>
              </span>
              <input
                id="email"
                type="email"
                className="input max-w-sm"
                placeholder="Enter your email"
                {...formRegister("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block transition mb-4"
            disabled={loading}
          >
            {loading ? "Processing..." : "Forgot Password"}
          </button>
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={(token) => setCaptchaToken(token)}
            ref={captchaRef}
          />
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
