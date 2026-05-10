import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { UseCase } from "@/types";

const USE_CASE_LABELS: Record<UseCase, string> = {
  coding: "Engineering / Coding",
  writing: "Content / Writing",
  data: "Data Analysis",
  research: "Research",
  mixed: "Mixed / General",
};

interface TeamInfoProps {
  teamSize: number;
  useCase: UseCase;
  onChange: (updates: { teamSize?: number; useCase?: UseCase }) => void;
}

export function TeamInfo({ teamSize, useCase, onChange }: TeamInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label htmlFor="teamSize" className="block text-xs font-medium text-slate-400">
          Team Size
        </label>
        <Input
          id="teamSize"
          type="number"
          min="1"
          value={teamSize}
          onChange={(e) => onChange({ teamSize: parseInt(e.target.value) || 1 })}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="useCase" className="block text-xs font-medium text-slate-400">
          Primary Use Case
        </label>
        <Select value={useCase} onValueChange={(v) => onChange({ useCase: v as UseCase })}>
          <SelectTrigger id="useCase">
            <span className="truncate">{USE_CASE_LABELS[useCase]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coding">Engineering / Coding</SelectItem>
            <SelectItem value="writing">Content / Writing</SelectItem>
            <SelectItem value="data">Data Analysis</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="mixed">Mixed / General</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
