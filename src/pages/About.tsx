import { Mail, Globe, Clock, Info } from "lucide-react";

const About = () => (
  <div className="container max-w-4xl mx-auto px-4 py-12">
    <h1 className="font-serif text-3xl mb-2">About Paperly</h1>
    <p className="text-muted-foreground text-sm mb-12">
      Everything you'd like to know about us.
    </p>

    {/* General Information */}
    <section className="mb-14">
      <div className="flex items-center gap-2 mb-5">
        <Info className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-2xl">About the Store</h2>
      </div>

      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        <p>
          Paperly is a Singapore-based online stationery store dedicated to makers,
          journalers, students, and anyone who believes the right pen changes everything.
          We curate pens, notebooks, markers, watercolour sets, art supplies, and craft
          materials — sourced from trusted brands including Muji, Staedtler, Tombow,
          Moleskine, Winsor & Newton, and Faber-Castell.
        </p>
        <p>
          We are an <span className="text-foreground font-medium">online-only store</span> — we
          do not operate a physical retail location. All orders are placed through this
          website and fulfilled via delivery within Singapore.
        </p>
        <p>
          Our Creative Paths guides are designed to help you find the right tools for
          your skill level and style, whether you're picking up a brush pen for the first
          time or stocking up a dedicated studio. We believe great stationery should be
          approachable, not overwhelming.
        </p>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { label: "Products", value: "300+" },
          { label: "Brands", value: "20+" },
          { label: "Delivery", value: "Nationwide SG" },
        ].map(stat => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border border-border bg-card text-center"
          >
            <p className="font-serif text-2xl text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Business Contact Information */}
    <section>
      <div className="flex items-center gap-2 mb-5">
        <Mail className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-2xl">Contact Us</h2>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        We're a small team and we read every message. For the fastest response, reach
        us by email — we don't currently operate a phone support line.
      </p>

      <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-start gap-4 p-5">
          <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">General enquiries</p>
            <a
              href="mailto:hello@paperly.sg"
              className="text-sm text-primary hover:underline"
            >
              hello@paperly.sg
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5">
          <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Order & delivery support</p>
            <a
              href="mailto:orders@paperly.sg"
              className="text-sm text-primary hover:underline"
            >
              orders@paperly.sg
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5">
          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Response time</p>
            <p className="text-sm text-muted-foreground">
              We reply within 1–2 business days (Mon–Fri, 9 am–6 pm SGT).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5">
          <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Online store only</p>
            <p className="text-sm text-muted-foreground">
              We do not have a physical shop or showroom. All purchases are made
              online and delivered to your address.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Paperly is registered and operated in Singapore. All prices on this site
        are in Singapore Dollars (SGD) and inclusive of GST where applicable.
      </p>
    </section>
  </div>
);

export default About;
