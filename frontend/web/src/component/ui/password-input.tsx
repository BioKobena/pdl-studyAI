"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";

interface PasswordInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
}

//effet du mot de passe visible/invisible
export default function PasswordInput({
  id = "password",
  label = "Mot de passe",
  placeholder = "•••••••••••••",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="text-[#3FA9D9] mb-2 block">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="pr-10 bg-white text-gray-600 border-gray-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3FA9D9] transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}
