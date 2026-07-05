'use client'
import { useRouter } from "next/navigation";
import React from "react";

export default function Mainpage() {
    const router = useRouter();
    const handleLogin = (role) =>{
        router.push(`/${role}/login`);
    }

  return (
    <main className="main-bodyheight bg-[#404177]">
     {/* <img src="/bg-png-doctor.png" alt="doctor png image" className="absolute flex items-center top-[40%]"/> */}
      <section className=" h-full w-[60%] mx-auto flex flex-col items-center justify-evenly">
        <div className="text-center">
          <div className="font-black text-white text-5xl tracking-wide mb-4 text-shadow-2xs">FIND A DOCTOR</div>
          <div className="text-white/60">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet
            porro facilis ullam veniam vitae esse id in et a maiores nemo rerum
            quam cum iste magni, voluptas harum hic error?
          </div>
        </div>

        <div className="w-full flex items-center justify-evenly gap-2">
          <div className="bg-white/60 shadow-sm px-10 py-10 rounded-md flex flex-col items-center justify-evenly gap-4">
            <span className="text-xl font-bold tracking-wide text-black/70 ">Login as Doctor</span>
            <button onClick={()=> handleLogin('doctor')} className="px-10 py-3 bg-[#fff] text-xs font-semibold rounded-md cursor-pointer transition duration-300 hover:bg-white/40">Go to Login</button>
          </div>
          <div className="bg-white/60 shadow-sm px-10 py-10 rounded-md flex flex-col items-center justify-evenly gap-4">
            <span className="text-xl font-bold tracking-wide text-black/70 ">Login as Patient</span>
            <button onClick={()=> handleLogin('patient')} className="px-10 py-3 bg-[#24aa4d] text-white text-xs font-semibold rounded-md cursor-pointer transition duration-300 hover:bg-[#24aa4d]/40">Go to Login</button>
          </div>
        </div>
      </section>
    </main>
  );
}
