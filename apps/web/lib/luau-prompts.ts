type LuauPromptInput = {
  missionName: string;
  townsInvolved: string[];
  objective: string;
  routeChoice: "short-risky" | "balanced" | "long-safe";
  includeServerModule: boolean;
};

export function buildLuauMissionPrompt(input: LuauPromptInput): string {
  return `
You are a senior Roblox gameplay engineer.
Generate production-ready Luau script snippets for FrontierDispatch.

Requirements:
- Output valid Luau.
- Include clear section comments.
- Include anti-exploit checks for client-triggered rewards.
- Include mission states: assigned, in_progress, completed, failed.
- Include route modifier logic for ${input.routeChoice}.
- Include event hooks for Dust storm, Broken bridge, Bandits.
- Keep code concise and practical.

Mission context:
- Mission name: ${input.missionName}
- Towns: ${input.townsInvolved.join(", ")}
- Objective: ${input.objective}
- Include server module: ${input.includeServerModule ? "yes" : "no"}

Return sections exactly:
1) -- Shared types/constants
2) -- Server mission handler
3) -- Client mission UI trigger
4) -- Test checklist
`;
}
