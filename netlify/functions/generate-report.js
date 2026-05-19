const generateReport = async (finalAnswers) => {
  setStep("generating");
  try {
    const res = await fetch("/.netlify/functions/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: reportType === "stack_fit" ? STACK_PROMPT : EVAL_PROMPT,
        prompt: reportType === "stack_fit"
          ? buildStackPrompt(finalAnswers)
          : buildEvalPrompt(finalAnswers),
      }),
    });
    const data = await res.json();
    const text = data.text || "";
    if (!text) throw new Error("empty");
    const sections = parseReport(text);
    if (!sections.length) throw new Error("no sections");
    setReportSections(sections);
    setStep("report");
  } catch (e) {
    setReportSections([{ title: "What We Heard", content: ["Unable to generate your report. Please try again."] }]);
    setStep("report");
  }
};
