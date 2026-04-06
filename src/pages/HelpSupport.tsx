import { HelpCircle, Sparkles, PackageX, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TIERS, EARN_RATES, REDEMPTION_RATE } from "@/data/inkPoints";

const HelpSupport = () => {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-2">
        Help &amp; Support
      </h1>
      <p className="text-muted-foreground text-center mb-12">
        Find answers to common questions, learn about our Ink Points system, and
        get help with returns.
      </p>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-serif font-semibold">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="payment">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept Visa, Mastercard, American Express, and PayNow. All
              transactions are processed securely and your card details are never
              stored on our servers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="order-change">
            <AccordionTrigger>Can I change or cancel my order?</AccordionTrigger>
            <AccordionContent>
              Orders can be modified or cancelled within 1 hour of placement.
              After that, the order enters processing and changes may not be
              possible. Please contact us at{" "}
              <a href="mailto:hello@inkpot.sg" className="underline text-primary">
                hello@inkpot.sg
              </a>{" "}
              as soon as possible.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="processing">
            <AccordionTrigger>How long does order processing take?</AccordionTrigger>
            <AccordionContent>
              Most orders are processed within 1–2 business days. During peak
              seasons or promotional events, processing may take up to 3 business
              days.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping">
            <AccordionTrigger>What are the shipping timeframes?</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Standard delivery: 3–5 business days</li>
                <li>Express delivery: 1–2 business days</li>
                <li>Free shipping on orders above S$40</li>
              </ul>
              We currently deliver within Singapore only.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tracking">
            <AccordionTrigger>How do I track my order?</AccordionTrigger>
            <AccordionContent>
              Once your order ships, you'll receive a confirmation email with a
              tracking link. You can also track your order from your Account page
              under "Order History."
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="account">
            <AccordionTrigger>I'm having trouble logging in</AccordionTrigger>
            <AccordionContent>
              Try resetting your password from the login page. If the issue
              persists, contact us at{" "}
              <a href="mailto:hello@inkpot.sg" className="underline text-primary">
                hello@inkpot.sg
              </a>{" "}
              and we'll help you regain access.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Ink Points ───────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-serif font-semibold">
            Ink Points — Tips &amp; Guidelines
          </h2>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="earn">
            <AccordionTrigger>How do I earn Ink Points?</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Purchases:</strong> {EARN_RATES.purchase} pt per S$1
                  spent (before tier multiplier)
                </li>
                <li>
                  <strong>Daily login:</strong> {EARN_RATES.dailyLogin} base pts
                  × your streak day (capped at 100)
                </li>
                <li>
                  <strong>Write a review:</strong> {EARN_RATES.review} pts (or{" "}
                  {EARN_RATES.photoReview} pts with a photo)
                </li>
                <li>
                  <strong>Answer Q&amp;A:</strong> {EARN_RATES.qaAnswer} pts
                </li>
                <li>
                  <strong>Referral:</strong> {EARN_RATES.referralComplete} pts
                  when your friend makes their first purchase
                </li>
                <li>
                  <strong>First purchase:</strong> {EARN_RATES.firstPurchase}{" "}
                  bonus pts
                </li>
                <li>
                  <strong>Creative Path completion:</strong>{" "}
                  {EARN_RATES.creativePathComplete} pts
                </li>
                <li>
                  <strong>Image search (first use):</strong>{" "}
                  {EARN_RATES.imageSearchFirstUse} pts
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tiers">
            <AccordionTrigger>What are the membership tiers?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {TIERS.map((tier) => (
                  <div key={tier.name} className="rounded-lg border p-4">
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: tier.color }}
                    >
                      {tier.badge}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {tier.minLifetime === 0
                        ? "Starting tier"
                        : `${tier.minLifetime.toLocaleString()}+ lifetime Ink Points`}
                      {" · "}
                      {tier.earnMultiplier}× earn rate
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-0.5">
                      {tier.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="redeem">
            <AccordionTrigger>How do I redeem points?</AccordionTrigger>
            <AccordionContent>
              Every {REDEMPTION_RATE} Ink Points can be redeemed for S$1.00 off
              your order at checkout. Points are applied automatically when you
              choose to use them during payment.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="challenges">
            <AccordionTrigger>What are Seasonal Challenges?</AccordionTrigger>
            <AccordionContent>
              Seasonal Challenges are limited-time events that boost your point
              earnings. For example, you might earn 2× points on notebook
              purchases or 1.5× for every review. Check the Promotions page for
              active challenges.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tips">
            <AccordionTrigger>Tips to maximise your Ink Points</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Log in daily to build your streak — points multiply!</li>
                <li>Write photo reviews for 50% more points than text-only</li>
                <li>Refer friends for a big one-time bonus</li>
                <li>Complete Creative Paths for 100 bonus points each</li>
                <li>
                  Watch for Seasonal Challenges with boosted earn rates
                </li>
                <li>
                  Reach Creator tier for a permanent 1.05× multiplier on all
                  purchases
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Returns ──────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <PackageX className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-serif font-semibold">
            Unsatisfactory Items &amp; Returns
          </h2>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="damaged">
            <AccordionTrigger>
              My item arrived damaged or defective
            </AccordionTrigger>
            <AccordionContent>
              We're sorry to hear that! Please email{" "}
              <a href="mailto:hello@inkpot.sg" className="underline text-primary">
                hello@inkpot.sg
              </a>{" "}
              within 7 days of delivery with your order number and photos of the
              damage. We'll arrange a replacement or full refund at no extra cost.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="eligibility">
            <AccordionTrigger>
              Return &amp; exchange eligibility
            </AccordionTrigger>
            <AccordionContent>
              Items may be returned or exchanged within 14 days of delivery,
              provided they are unused, in original packaging, and accompanied
              by proof of purchase. Personalised or custom items are
              non-returnable unless defective.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="initiate">
            <AccordionTrigger>How do I start a return?</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Go to your Account → Order History and select the order.
                </li>
                <li>Click "Return Item" and follow the prompts.</li>
                <li>
                  Alternatively, email{" "}
                  <a
                    href="mailto:hello@inkpot.sg"
                    className="underline text-primary"
                  >
                    hello@inkpot.sg
                  </a>{" "}
                  with your order number and reason.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refund">
            <AccordionTrigger>Refund process &amp; timeline</AccordionTrigger>
            <AccordionContent>
              Once we receive your returned item, we'll inspect it within 2
              business days. Approved refunds are processed back to your original
              payment method within 5–7 business days. You'll receive an email
              confirmation when the refund is issued.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────── */}
      <div className="rounded-xl border bg-muted/40 p-6 text-center">
        <Mail className="w-6 h-6 mx-auto mb-2 text-primary" />
        <h3 className="font-serif font-semibold mb-1">Still need help?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Our support team is available Mon–Fri, 9 am – 6 pm SGT.
        </p>
        <a
          href="mailto:hello@inkpot.sg"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          hello@inkpot.sg
        </a>
      </div>
    </div>
  );
};

export default HelpSupport;
