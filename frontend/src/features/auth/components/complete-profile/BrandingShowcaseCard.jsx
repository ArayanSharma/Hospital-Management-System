import React from "react";
import { Shield, Sparkles, Heart, Headphones } from "lucide-react";

export default function BrandingShowcaseCard() {
  return (
    <div className="lg:col-span-4 bg-gradient-to-b from-blue-600 to-indigo-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[640px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black text-2xl shadow-lg">
            +
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none text-white">
              CityCare
            </h2>
            <span className="text-xs font-extrabold tracking-widest text-blue-200 uppercase">
              HOSPITAL
            </span>
          </div>
        </div>
        <p className="text-xs text-blue-100 font-medium italic mb-6">
          Better Care. Healthier Tomorrow.
        </p>

        <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl mb-6 group">
          <img
            src="/loginImg/loginImg.png"
            alt="CityCare Hospital Exterior & Ambulance"
            className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Emergency & Specialty Care
            </span>
            <h3 className="text-sm font-extrabold text-white">
              State-of-the-Art Medical Infrastructure
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
          <h4 className="text-xs font-bold text-white mb-1">
            Trusted Healthcare Management
          </h4>
          <p className="text-[11px] text-blue-100 flex items-center gap-2">
            <span>Compassion</span> • <span>Technology</span> • <span>People</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center">
            <Shield className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-[10px] font-semibold text-white">Safe & Secure</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center">
            <Sparkles className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-[10px] font-semibold text-white">Real-time Access</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center">
            <Heart className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-[10px] font-semibold text-white">Patient First</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center">
            <Headphones className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-[10px] font-semibold text-white">24/7 Support</span>
          </div>
        </div>

        <p className="text-[11px] text-center italic text-blue-200 font-medium pt-2">
          “Your Health, Our Priority”
        </p>
      </div>
    </div>
  );
}
