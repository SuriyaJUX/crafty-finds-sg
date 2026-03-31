import { useState } from "react";
import { qaData } from "@/data/products";
import type { QAQuestion } from "@/data/types";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

interface Props {
  productId: string;
}

const ProductQA = ({ productId }: Props) => {
  const [questions, setQuestions] = useState<QAQuestion[]>(
    qaData.filter(q => q.productId === productId)
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!questionText.trim()) return;
    const newQ: QAQuestion = {
      id: `q-${Date.now()}`,
      productId,
      question: questionText.trim(),
      askedBy: "You",
      answers: [],
      createdAt: new Date().toISOString(),
    };
    setQuestions(prev => [...prev, newQ]);
    setExpanded(newQ.id);
    setQuestionText("");
    setAskOpen(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-serif text-2xl">Questions & Answers</h2>
        <button
          onClick={() => { setAskOpen(v => !v); setSubmitted(false); }}
          className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          <MessageCircle className="w-4 h-4" />
          Ask a question
        </button>
      </div>

      {/* Inline ask form */}
      {askOpen && (
        <div className="p-4 rounded-lg border border-border bg-card mb-4 animate-fade-in">
          <p className="text-sm font-medium mb-2">Your question</p>
          <textarea
            className="w-full text-sm rounded-md border border-border bg-background p-3 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
            placeholder="What would you like to know about this product?"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && e.ctrlKey && handleSubmit()}
            autoFocus
          />
          <div className="flex gap-2 mt-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setAskOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!questionText.trim()}>
              Submit question
            </Button>
          </div>
        </div>
      )}

      {submitted && (
        <p className="text-sm text-secondary font-medium mb-4 flex items-center gap-1.5 animate-fade-in">
          <BadgeCheck className="w-4 h-4" />
          Question submitted — our team will answer shortly.
        </p>
      )}

      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-3">
          {questions.map(q => {
            const isOpen = expanded === q.id;
            return (
              <div key={q.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <button
                  className="w-full flex items-start justify-between p-4 text-left gap-3 hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : q.id)}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Asked by {q.askedBy} · {new Date(q.createdAt).toLocaleDateString("en-SG")}
                      {q.answers.length > 0 && (
                        <span className="ml-2 text-secondary font-medium">
                          {q.answers.length} {q.answers.length === 1 ? "answer" : "answers"}
                        </span>
                      )}
                    </p>
                  </div>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-0.5" />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-0.5" />
                  }
                </button>

                {isOpen && (
                  <div className="border-t border-border">
                    {q.answers.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-muted-foreground italic">No answers yet.</p>
                    ) : (
                      <div className="px-4 py-3 space-y-4">
                        {q.answers.map(a => (
                          <div key={a.id} className="flex gap-3">
                            <div className="w-0.5 bg-border rounded-full flex-shrink-0 self-stretch" />
                            <div>
                              <p className="text-sm leading-relaxed">{a.text}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-muted-foreground">{a.answeredBy}</span>
                                {a.isVerifiedBuyer && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary font-medium">
                                    <BadgeCheck className="w-3 h-3" /> Verified buyer
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(a.createdAt).toLocaleDateString("en-SG")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductQA;
