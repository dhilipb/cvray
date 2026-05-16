import { spawn } from "child_process";

export class GeminiWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
    this.geminiInProgress = false;
  }

  apply(compiler) {
    compiler.hooks.done.tap("GeminiWebpackPlugin", (stats) => {
      if (
        !stats.hasErrors() ||
        this.geminiInProgress ||
        process.env.SKIP_GEMINI
      )
        return;

      const info = stats.toJson({
        all: false,
        errors: true,
      });

      const errors = info.errors
        .map((err) => {
          const file = err.file || err.moduleName || "Unknown file";
          const message = err.message || "Unknown error";
          return `File: ${file}\nError: ${message}`;
        })
        .join("\n\n");

      if (!errors) return;

      this.geminiInProgress = true;
      console.log(
        "\n[Gemini Plugin] Compilation errors detected. Launching Gemini...\n",
      );

      const gemini = spawn(
        "gemini",
        [
          "--prompt-interactive",
          "--yolo",
          `I've detected compilation errors in the dev server:\n\n\`\`\`\n${errors}\n\`\`\`\n\nPlease fix them.`,
        ],
        {
          stdio: "inherit",
        },
      );

      gemini.on("close", () => {
        this.geminiInProgress = false;
      });
    });
  }
}
