import React from "react";
import { ToolInfo } from "@/types/evaluation";

interface ToolInfoFormProps {
  toolInfo: ToolInfo;
  onChange: (info: ToolInfo) => void;
}

const ToolInfoForm: React.FC<ToolInfoFormProps> = ({ toolInfo, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E7EB]">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          Nom de l'outil
        </label>
        <input
          type="text"
          value={toolInfo.name}
          onChange={(e) => onChange({ ...toolInfo, name: e.target.value })}
          placeholder="ex: ChatGPT, Mistral…"
          className="w-full border-none border-b border-gray-300 text-sm text-gray-800 outline-none bg-transparent pb-1 focus:border-[#005E6E]"
        />
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E7EB]">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          URL
        </label>
        <input
          type="url"
          value={toolInfo.url || ""}
          onChange={(e) => onChange({ ...toolInfo, url: e.target.value })}
          placeholder="ex: https://chat.openai.com"
          className="w-full border-none border-b border-gray-300 text-sm text-gray-800 outline-none bg-transparent pb-1 focus:border-[#005E6E]"
        />
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E7EB]">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          Éditeur
        </label>
        <input
          type="text"
          value={toolInfo.editor || ""}
          onChange={(e) => onChange({ ...toolInfo, editor: e.target.value })}
          placeholder="ex: OpenAI, Mistral AI…"
          className="w-full border-none border-b border-gray-300 text-sm text-gray-800 outline-none bg-transparent pb-1 focus:border-[#005E6E]"
        />
      </div>
    </div>
  );
};

export default ToolInfoForm;
