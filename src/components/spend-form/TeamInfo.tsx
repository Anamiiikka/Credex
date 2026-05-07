import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseCase } from "@/types";

interface TeamInfoProps {
  teamSize: number;
  useCase: UseCase;
  onChange: (updates: { teamSize?: number; useCase?: UseCase }) => void;
}

export function TeamInfo({ teamSize, useCase, onChange }: TeamInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teamSize">Team Size</Label>
          <Input 
            id="teamSize" 
            type="number" 
            min="1" 
            value={teamSize} 
            onChange={(e) => onChange({ teamSize: parseInt(e.target.value) || 1 })} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="useCase">Primary Use Case</Label>
          <Select value={useCase} onValueChange={(v) => onChange({ useCase: v as UseCase })}>
            <SelectTrigger id="useCase">
              <SelectValue placeholder="Select use case" />
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
      </CardContent>
    </Card>
  );
}
