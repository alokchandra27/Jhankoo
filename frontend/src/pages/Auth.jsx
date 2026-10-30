import LeftDiv from "./Auth/LeftDiv";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import API from "../components/API/API";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const Auth = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const rightDivRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!isLogin) {
      data.fullName = {
        firstName: data.firstName,
        lastName: data.name,
      };

      delete data.firstName;
      delete data.name;
    }

    if (!data.email || !data.password) {
      toast.info("Please fill in your email and password");
      return;
    }

    if (!isLogin && !data.fullName.firstName) {
      toast.info("Please enter your first name.");
      return;
    }

    handleAuth(data, e);
  };

  const handleAuth = async (data, e) => {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      setIsLoading(true);

      const toastId = toast.loading(isLogin ? "Signing you in..." : "Creating your account...");

      const response = await API.post(endpoint, data);

      if (isLogin) {
        const token = response?.data?.token;

        if (token) {
          localStorage.setItem("token", token);
        }

        if (response?.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        setIsLoggedIn(true);
        navigate("/products");
      }

      toast.update(toastId, {
        render: isLogin ? `Welcome back, ${response?.data?.user?.storeName || "Seller"} 👋` : "Account created successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      e.target.reset();
    } catch (error) {
      toast.dismiss();

      const message =
        error?.response?.data?.message === "Invalid credentials" ? "Incorrect email or password. Try again." : error?.response?.data?.message || "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useGSAP(
    () => {
      gsap.from(rightDivRef.current, {
        x: 80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: rightDivRef },
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-creator-bg text-creator-text lg:-mt-10">
      <section className="flex h-full w-full flex-col lg:flex-row">
        {/*  LEFT  */}
        <LeftDiv />

        {/*RIGHT (SELLER REGISTER PANEL) */}
        <div
          ref={rightDivRef}
          className="w-full lg:w-1/2 h-screen lg:h-screen flex items-center justify-center px-4 sm:px-8 py-6 lg:py-0 border-t-0 lg:border-t-0 lg:border-l-[1px] border-creator-accent relative bg-creator-bg overflow-hidden"
        >
          {/* Form Main Container */}
          <div className=" w-full max-w-[440px] bg-white rounded-2xl px-5 py-0 sm:p-7 shadow-sm border border-neutral-100/80 flex flex-col relative">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="animate-label font-serif font-bold text-lg tracking-tight text-neutral-800">Jhankoo</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-800 tracking-tight">{!isLogin ? "Create Your Store 😎" : "Welcome Back👋!"}</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 font-light">{!isLogin ? "Join a community of creators" : "Login to your creator dasboard"}</p>
            </div>

            {/* Form Elements */}
            <form onSubmit={submitHandler} className="space-y-2.5">
              {/* First Name & Last Name (Side by Side) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-creator-pink transition-colors placeholder:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Last Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter last name"
                      className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-creator-pink transition-colors placeholder:text-neutral-300"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-creator-pink transition-colors placeholder:text-neutral-300"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Your username"
                    className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-creator-pink transition-colors placeholder:text-neutral-300"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Store Name</label>
                  <div className="relative">
                    <input
                      name="storeName"
                      type="text"
                      placeholder="Your store name"
                      className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-creator-pink transition-colors placeholder:text-neutral-300 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-300 text-xs">🔗</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-creator-pink transition-colors placeholder:text-neutral-300 pr-8"
                  />

                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-xs cursor-pointer select-none">
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              {!isLogin && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 animate-pulse-slow">
                  {/* Alert Icon */}
                  <span className="text-base sm:text-lg mt-0.5 leading-none">⚠️</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-amber-800 tracking-wide uppercase">Important Note</h4>
                    <p className="text-[11px] text-amber-700 leading-normal mt-0.5 font-medium">
                      Please keep your <b>Email and Password safe</b> and make a note of them. Currently, there is no option for password recovery, so this is the only way to log in.
                    </p>
                    <p className="text-[11px] text-amber-700 leading-normal mt-0.5 font-medium">
                      (Kripya apna <b>Email aur Password safe rakhen aur note kar lein</b>. Abhi forget password ka option available nahi hai, isliye login karne ka yahi ekmaatra tarika hai.)
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-300 tracking-wide text-white flex items-center justify-center gap-2 ${isLoading ? "bg-neutral-400 cursor-not-allowed opacity-80" : "bg-[#1A2E26] hover:bg-neutral-800 cursor-pointer"}`}
                >
                  {isLoading ? (isLogin ? "Signing in..." : "Creating Store...") : isLogin ? "Sign In" : "Create Store"}

                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Footer Redirect Link */}
              <div className="text-center pt-1">
                <p className="text-[11px] text-neutral-500 font-light">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <span
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setShowPassword(false);
                    }}
                    className="font-semibold text-neutral-800 hover:underline cursor-pointer ml-1"
                  >
                    {isLogin ? "Register" : "Login"}
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
