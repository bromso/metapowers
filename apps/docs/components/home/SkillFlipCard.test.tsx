import { SkillFlipCard } from "@/components/home/SkillFlipCard";
import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";

test("server markup carries both faces and both labels", () => {
	const html = renderToString(<SkillFlipCard front={<p>FRONT</p>} back={<p>BACK</p>} />);
	expect(html).toContain("FRONT");
	expect(html).toContain("BACK");
	expect(html).toContain("Flip to see what it writes");
	expect(html).toContain("Flip back to the skill");
});
