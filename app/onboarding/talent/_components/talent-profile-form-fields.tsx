import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const isTesting =
  process.env._TESTING === "true" ||
  process.env.NEXT_PUBLIC__TESTING === "true" ||
  process.env.NEXT_PUBLIC_TESTING === "true";

const yearLevelOptions = [
  { label: "1st year", value: "1" },
  { label: "2nd year", value: "2" },
  { label: "3rd year", value: "3" },
  { label: "4th year", value: "4" },
];

type BasicInfoFieldsProps = {
  bio: string;
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
  headline: string;
  setBio: (value: string) => void;
  setHeadline: (value: string) => void;
  setWebsite: (value: string) => void;
  website: string;
};

export function TalentBasicInfoFields({
  bio,
  currentUser,
  headline,
  setBio,
  setHeadline,
  setWebsite,
  website,
}: BasicInfoFieldsProps) {
  const bioLength = bio.length;
  const headlineLength = headline.length;
  const bioLengthClassName =
    bioLength < 150 || bioLength > 500
      ? "text-[color:var(--tone-red-base)]"
      : "text-[color:var(--ink-soft)]";
  const headlineLengthClassName =
    headlineLength < 25 || headlineLength > 70
      ? "text-[color:var(--tone-red-base)]"
      : "text-[color:var(--ink-soft)]";
  const fullName = [currentUser.firstName, currentUser.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm font-semibold" htmlFor="ob-username">
            Username <span className="text-[color:var(--tone-red-base)]">*</span>
          </Label>
          <Input
            className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm text-[color:var(--ink-muted)] sm:h-11 sm:rounded-xl"
            id="ob-username"
            placeholder="e.g. maria-santos"
            readOnly
            required
            value={currentUser.username}
          />
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm font-semibold" htmlFor="ob-fullname">
            Full Name <span className="text-[color:var(--tone-red-base)]">*</span>
          </Label>
          <Input
            className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm text-[color:var(--ink-muted)] sm:h-11 sm:rounded-xl"
            id="ob-fullname"
            placeholder="Maria Santos"
            readOnly
            required
            value={fullName}
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm font-semibold" htmlFor="ob-website">
          Website
        </Label>
        <Input
          className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
          id="ob-website"
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://yourportfolio.com"
          type="url"
          value={website}
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm font-semibold" htmlFor="ob-headline">
          Headline <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <Input
          className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
          id="ob-headline"
          maxLength={70}
          minLength={25}
          onChange={(event) => setHeadline(event.target.value)}
          placeholder="e.g. UI/UX Designer & Prototyping Specialist"
          required
          value={headline}
        />
        {!isTesting ? (
          <p className={`text-xs ${headlineLengthClassName}`}>
            {headlineLength}/70 characters (minimum 25)
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm font-semibold" htmlFor="ob-bio">
          Bio <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <Textarea
          className="min-h-28 rounded-2xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm sm:rounded-xl"
          id="ob-bio"
          maxLength={500}
          minLength={150}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Tell clients about yourself, your experience, and what makes you unique..."
          required
          rows={4}
          value={bio}
        />
        {!isTesting ? (
          <p className={`text-xs ${bioLengthClassName}`}>
            {bioLength}/500 characters (minimum 150)
          </p>
        ) : null}
      </div>
    </div>
  );
}

type StudentDetailsFieldsProps = {
  college: string;
  course: string;
  setCollege: (value: string) => void;
  setCourse: (value: string) => void;
  setYearLevel: (value: string) => void;
  yearLevel: string;
};

export function TalentStudentDetailsFields({
  college,
  course,
  setCollege,
  setCourse,
  setYearLevel,
  yearLevel,
}: StudentDetailsFieldsProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm font-semibold" htmlFor="ob-college">
          College <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <Input
          className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
          id="ob-college"
          onChange={(event) => setCollege(event.target.value)}
          placeholder="e.g. College of Science"
          required
          value={college}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm font-semibold" htmlFor="ob-course">
            Course <span className="text-[color:var(--tone-red-base)]">*</span>
          </Label>
          <Input
            className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
            id="ob-course"
            onChange={(event) => setCourse(event.target.value)}
            placeholder="e.g. BS Information Technology"
            required
            value={course}
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm font-semibold" htmlFor="ob-year">
            Year Level{" "}
            <span className="text-[color:var(--tone-red-base)]">*</span>
          </Label>
          <Select
            id="ob-year"
            items={yearLevelOptions}
            name="yearLevel"
            onValueChange={(value) => setYearLevel(value ?? "")}
            required
            value={yearLevel || null}
          >
            <SelectTrigger className="h-10 w-full rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
              {yearLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
