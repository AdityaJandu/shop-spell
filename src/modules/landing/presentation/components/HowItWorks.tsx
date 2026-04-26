import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Settings2, Rocket } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      label: "DESCRIBE IT",
      title: "Talk to your architect",
      description: "Tell ShopSpell AI what you sell and how you want it to feel. It listens, understands context, and begins drafting.",
      icon: MessageSquare,
      bgColor: "bg-secondary-container/20",
      iconColor: "text-on-secondary-container",
    },
    {
      id: "02",
      label: "REFINE IT",
      title: "Tweak and iterate",
      description: "Review the live preview. Ask for changes like \"make it warmer\" or \"add a newsletter signup\" and watch it update instantly.",
      icon: Settings2,
      bgColor: "bg-primary-container/10",
      iconColor: "text-on-primary-container",
    },
    {
      id: "03",
      label: "LAUNCH IT",
      title: "Publish to the world",
      description: "Connect your domain, add your payment details securely, and click publish. You're ready to accept orders.",
      icon: Rocket,
      bgColor: "bg-tertiary-container/20",
      iconColor: "text-on-tertiary-container",
    }
  ];

  return (
    <section className="w-full mt-32 max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground">
          From idea to inventory.
        </h2>
        <p className="text-lg text-muted-foreground mt-4">
          Three steps to launch your digital boutique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <Card key={step.id} className="bg-card border-border/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center ${step.iconColor} mb-2`}>
                <step.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold pt-2">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
