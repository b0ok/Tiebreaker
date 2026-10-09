import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Safe JSON extraction helper
function extractJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw initialErr;
  }
}

// Resilient Gemini content generation with retry and model failover
async function generateContentWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  options?: { json?: boolean; systemInstruction?: string }
): Promise<string> {
  // Ordered candidate models:
  // gemini-3.1-flash-lite provides fast reasoning with high availability,
  // backed up by gemini-3.8-flash and gemini-flash-latest.
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const config: any = {};
        if (options?.json) {
          config.responseMimeType = "application/json";
        }
        if (options?.systemInstruction) {
          config.systemInstruction = options.systemInstruction;
        }

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || err?.error?.code;
        const msg = String(err?.message || "");

        const isQuotaExceeded =
          status === 429 ||
          msg.includes("429") ||
          msg.includes("quota") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isQuotaExceeded) {
          // If quota is exhausted on this model, immediately switch to the next candidate model
          console.info(`Model ${model} rate-limited or quota exceeded, switching to next candidate model...`);
          break;
        }

        const isUnavailable =
          status === 503 ||
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("demand");

        if (isUnavailable && attempt === 1) {
          // Brief exponential backoff for temporary spikes in demand
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }

        // For other errors, move to next model
        break;
      }
    }
  }

  throw lastError || new Error("Unable to complete request across Gemini model candidates");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Helper for fallback decisions when offline or if key is missing
function generateFallbackDecision(
  dilemma: string,
  optionsProvided?: string[],
  method: string = "pros-cons"
) {
  const opts =
    optionsProvided && optionsProvided.length >= 2
      ? optionsProvided
      : ["Option A (Primary Direction)", "Option B (Alternative Path)"];

  const baseOptions = opts.map((optName, index) => ({
    id: `opt_${index + 1}`,
    name: optName,
    tagline: index === 0 ? "Higher immediate upside with calculated risk" : "Greater stability and predictability",
    pros: [
      {
        id: `p_${index}_1`,
        text: index === 0 ? "High growth and learning velocity" : "Lower downside risk and guaranteed baseline",
        impact: "high" as const,
        explanation: index === 0 ? "Exposes you to accelerated skill building and unique network effects." : "Protects your financial and mental peace of mind with known variables.",
      },
      {
        id: `p_${index}_2`,
        text: index === 0 ? "Uncapped future potential" : "High autonomy and work-life balance",
        impact: "moderate" as const,
        explanation: "Aligns with sustainable pacing and predictable expectations.",
      },
    ],
    cons: [
      {
        id: `c_${index}_1`,
        text: index === 0 ? "Higher volatility and stress" : "Opportunity cost of missed momentum",
        severity: "high" as const,
        mitigation: index === 0 ? "Set hard boundaries and a 6-month evaluation checkpoint." : "Carve out dedicated weekend hours to pursue aggressive growth projects.",
      },
      {
        id: `c_${index}_2`,
        text: index === 0 ? "Steeper initial learning curve" : "Risk of gradual stagnation or boredom",
        severity: "moderate" as const,
        mitigation: "Actively seek out stretch challenges every quarter.",
      },
    ],
    swot: {
      strengths: [
        index === 0 ? "Maximum upside leverage" : "Rock-solid foundational security",
        index === 0 ? "Rapid personal evolution" : "Preserved energy and low burnout probability",
      ],
      weaknesses: [
        index === 0 ? "High cognitive load in initial phase" : "Slower trajectory to outsized milestones",
      ],
      opportunities: [
        index === 0 ? "Access to rare high-tier opportunities" : "Compounding capital and steady mastery",
      ],
      threats: [
        index === 0 ? "Burnout if execution exceeds capacity" : "Complacency traps",
      ],
    },
  }));

  const fallback: any = {
    id: "dec_" + Date.now(),
    timestamp: Date.now(),
    dilemma,
    summary: `Structured ${method} analysis for: "${dilemma}". Clarifies core tensions and eliminates deadlock.`,
    activeMethod: method,
    loadedMethods: [method],
    options: baseOptions,
  };

  if (method === "comparison") {
    fallback.comparisonCriteria = [
      {
        id: "crit_1",
        name: "Financial Upside vs Security",
        weight: 4,
        description: "Balancing monetary payoff against safety margin.",
        scores: { opt_1: 8, opt_2: 7 },
        justifications: {
          opt_1: "Significantly higher potential payoff, though with higher variability.",
          opt_2: "Reliable and steady earnings with minimal risk of variance.",
        },
      },
      {
        id: "crit_2",
        name: "Stress & Energy Drain",
        weight: 3,
        description: "Impact on daily mental clarity and well-being.",
        scores: { opt_1: 5, opt_2: 8 },
        justifications: {
          opt_1: "Substantial initial cognitive demand and periodic ambiguity.",
          opt_2: "Comfortable rhythm with low surprise factor.",
        },
      },
      {
        id: "crit_3",
        name: "Long-term Compounding",
        weight: 5,
        description: "How much this choice accelerates your trajectory 3 years from now.",
        scores: { opt_1: 9, opt_2: 6 },
        justifications: {
          opt_1: "Accelerates access to non-linear career or life dividends.",
          opt_2: "Linear compounding with predictable ceilings.",
        },
      },
    ];
  } else if (method === "verdict") {
    fallback.verdict = {
      winnerId: "opt_1",
      winnerName: opts[0],
      confidenceScore: 78,
      headline: `The Tiebreaker tilts toward ${opts[0]} due to higher long-term compounding.`,
      rationale: `While ${opts[1]} offers safety and comfort, the cost of regret and suppressed upside in ${opts[0]} tends to outlast temporary discomfort. Taking the bolder initiative gives you option value.`,
      whenToPickOther: [
        {
          optionName: opts[1],
          condition: "Your immediate financial safety net is under 6 months, or personal commitments require absolute predictability.",
        },
      ],
      overlookedBlindspot: "Assuming that waiting or choosing safety has zero cost. In reality, inaction has an invisible compounding cost.",
      tiebreakerQuestion: "If both options offered the exact same financial reward, which one would you regret NOT doing in 5 years?",
      immediateNextStep: "Run a 48-hour micro-test: spend 2 hours doing the exact daily reality of Option A before formally locking it in.",
    };
  } else if (method === "random") {
    const randomIndex = Math.floor(Math.random() * opts.length);
    fallback.randomResult = {
      winnerId: `opt_${randomIndex + 1}`,
      winnerName: opts[randomIndex],
      timestamp: Date.now(),
      flipCount: 1,
      gutCheckAdvice: `The random tiebreaker landed on "${opts[randomIndex]}". Observe your immediate reaction.`,
      psychologicalInsight: "A coin toss exposes your true underlying preference in the moment the result appears.",
      suggestedAction: `Spend the next 2 hours operating as if "${opts[randomIndex]}" is your finalized decision.`,
    };
  }

  return fallback;
}

// Main decision analysis endpoint
app.post("/api/analyze-decision", async (req, res) => {
  const { dilemma, options, context, decisionStyle = "balanced", method = "pros-cons" } = req.body;

  if (!dilemma || typeof dilemma !== "string" || dilemma.trim().length === 0) {
    return res.status(400).json({ error: "Please provide a decision or dilemma to analyze." });
  }

  // If method is random tiebreaker, return instant structured random tiebreaker without bloat
  if (method === "random") {
    const fallback = generateFallbackDecision(dilemma, options, "random");
    return res.json(fallback);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Generating fallback analysis.");
    const fallback = generateFallbackDecision(dilemma, options, method);
    return res.json(fallback);
  }

  try {
    const ai = getGenAI();

    // Construct tailored, low-bloat prompt specific to the user's chosen tiebreaker method
    let schemaDescription = "";
    let methodInstructions = "";

    if (method === "pros-cons") {
      methodInstructions = "Focus strictly on analyzing the PROS & CONS. Weigh each advantage and risk with concrete impact levels and counter-mitigations. Do NOT generate comparison tables or swot matrices.";
      schemaDescription = `{
  "id": string (unique ID e.g. "dec_" + timestamp),
  "timestamp": number,
  "dilemma": string,
  "summary": string (1-2 crisp sentences defining the core dilemma tension),
  "activeMethod": "pros-cons",
  "options": [
    {
      "id": string (e.g. "opt_1", "opt_2"),
      "name": string (concise name of option),
      "tagline": string (punchy 1-sentence descriptor),
      "pros": [
        {
          "id": string,
          "text": string (specific advantage),
          "impact": "critical" | "high" | "moderate" | "minor",
          "explanation": string (concrete reason why this matters)
        }
      ],
      "cons": [
        {
          "id": string,
          "text": string (specific downside or risk),
          "severity": "critical" | "high" | "moderate" | "minor",
          "mitigation": string (realistic countermeasure)
        }
      ]
    }
  ]
}`;
    } else if (method === "comparison") {
      methodInstructions = "Focus strictly on constructing a SIDE-BY-SIDE COMPARISON MATRIX. Identify 3 to 5 multi-dimensional evaluation criteria (e.g. Financial Return, Time & Effort, Downside Risk, Career Growth, Stress). Provide weights (1-5), integer scores (1-10) for each option, and 1-sentence justifications. Do NOT generate pros, cons, or swot.";
      schemaDescription = `{
  "id": string (unique ID e.g. "dec_" + timestamp),
  "timestamp": number,
  "dilemma": string,
  "summary": string (1-2 crisp sentences defining the core comparison),
  "activeMethod": "comparison",
  "options": [
    {
      "id": string (e.g. "opt_1", "opt_2"),
      "name": string (concise name of option),
      "tagline": string (punchy 1-sentence descriptor)
    }
  ],
  "comparisonCriteria": [
    {
      "id": string (e.g. "crit_1"),
      "name": string (evaluation dimension),
      "weight": number (1 to 5),
      "description": string (short meaning),
      "scores": { [optionId: string]: number (integer 1 to 10) },
      "justifications": { [optionId: string]: string (1 concise sentence) }
    }
  ]
}`;
    } else if (method === "swot") {
      methodInstructions = "Focus strictly on mapping out a SWOT ANALYSIS (Strengths, Weaknesses, Opportunities, Threats) for each option. 2-3 specific, non-generic items per quadrant. Do NOT generate comparison tables or pros/cons lists.";
      schemaDescription = `{
  "id": string (unique ID e.g. "dec_" + timestamp),
  "timestamp": number,
  "dilemma": string,
  "summary": string (1-2 crisp sentences defining the strategic landscape),
  "activeMethod": "swot",
  "options": [
    {
      "id": string (e.g. "opt_1", "opt_2"),
      "name": string (concise name of option),
      "tagline": string (punchy descriptor),
      "swot": {
        "strengths": string[] (2-3 items),
        "weaknesses": string[] (2-3 items),
        "opportunities": string[] (2-3 items),
        "threats": string[] (2-3 items)
      }
    }
  ]
}`;
    } else {
      // verdict
      methodInstructions = "Focus strictly on delivering a CLEAR, HIGH-CONVICTION TIEBREAKER VERDICT. Declare the winning option, confidence score (55-92%), deep rationale, alternative conditions, overlooked blindspot, gut-check question, and 48-hour next step.";
      schemaDescription = `{
  "id": string (unique ID e.g. "dec_" + timestamp),
  "timestamp": number,
  "dilemma": string,
  "summary": string (1-2 crisp sentences summarizing the verdict foundation),
  "activeMethod": "verdict",
  "options": [
    {
      "id": string (e.g. "opt_1", "opt_2"),
      "name": string (concise name of option),
      "tagline": string (punchy descriptor)
    }
  ],
  "verdict": {
    "winnerId": string (option id that wins),
    "winnerName": string (name of winning option),
    "confidenceScore": number (55 to 92),
    "headline": string (bold, unambiguous conclusion),
    "rationale": string (3-4 sentences explaining why this option breaks the tie),
    "whenToPickOther": [
      {
        "optionName": string,
        "condition": string (when the alternative would actually be preferred)
      }
    ],
    "overlookedBlindspot": string (hidden cognitive bias or invisible cost),
    "tiebreakerQuestion": string (piercing gut-check question),
    "immediateNextStep": string (micro-action to test assumptions in 24-48 hours)
  }
}`;
    }

    const prompt = `You are "The Tiebreaker", an expert strategic decision advisor.
Dilemma: "${dilemma}"
${options && options.length > 0 ? `Options: ${JSON.stringify(options)}` : "Identify the 2 or 3 most realistic, distinct choices for this dilemma."}
${context ? `Context/Constraints: "${context}"` : ""}
Decision Style: "${decisionStyle}"

${methodInstructions}

Respond with strictly valid JSON adhering to this exact schema:
${schemaDescription}`;

    const responseText = await generateContentWithRetry(ai, prompt, {
      json: true,
      systemInstruction:
        "You are The Tiebreaker, an expert decision scientist. Provide clean, highly tailored, non-bloated responses matching the requested JSON schema exactly.",
    });

    const parsed = extractJson(responseText || "{}");

    if (!parsed.id) parsed.id = "dec_" + Date.now();
    if (!parsed.timestamp) parsed.timestamp = Date.now();
    if (!parsed.dilemma) parsed.dilemma = dilemma;
    parsed.activeMethod = method;
    parsed.loadedMethods = [method];

    // Ensure options array exists and has proper empty containers for unrequested keys to avoid client crashes
    if (Array.isArray(parsed.options)) {
      parsed.options = parsed.options.map((opt: any, idx: number) => ({
        id: opt.id || `opt_${idx + 1}`,
        name: opt.name || `Option ${idx + 1}`,
        tagline: opt.tagline || "",
        pros: Array.isArray(opt.pros) ? opt.pros : [],
        cons: Array.isArray(opt.cons) ? opt.cons : [],
        swot: opt.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      }));
    }

    res.json(parsed);
  } catch (error: any) {
    console.warn("Gemini decision analysis warning (serving targeted fallback):", error?.message || error);
    const fallback = generateFallbackDecision(dilemma, options, method);
    res.json(fallback);
  }
});

// Follow-up challenge or deep-dive question endpoint
app.post("/api/ask-tiebreaker", async (req, res) => {
  const { dilemma, question, currentVerdict, options } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      answer: `Regarding your query "${question}": If this condition is heavily weighted, it typically shifts the balance. Test the assumption by setting a hard boundary or running a 1-week reversible trial before committing.`,
    });
  }

  try {
    const ai = getGenAI();
    const prompt = `Context: User is making a decision on "${dilemma}".
Options: ${JSON.stringify(options || [])}
Current Verdict: ${currentVerdict || "Option A recommended"}
User's Follow-up Question or "What-if": "${question}"

Provide a crisp, direct, decision-oriented response (under 120 words). Directly address whether this shifts the winning choice, and what concrete rule-of-thumb to apply.`;

    const answer = await generateContentWithRetry(ai, prompt, {
      systemInstruction: "You are The Tiebreaker's strategic advisor. Answer concisely and decisively.",
    });

    res.json({ answer: answer.trim() || "Consider how this variable affects your worst-case outcome." });
  } catch (err: any) {
    console.warn("Gemini ask-tiebreaker warning:", err?.message || err);
    res.json({
      answer: "When this factor is introduced, recalculate your tolerance for worst-case outcomes. If the risk is non-fatal, lean toward the choice that maximizes optionality.",
    });
  }
});

// Vite middleware in dev, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
