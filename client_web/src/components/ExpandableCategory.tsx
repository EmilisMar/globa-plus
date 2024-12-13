import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface ExpandableCategoryProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
}

export default function ExpandableCategory({ title, children, icon: Icon }: ExpandableCategoryProps) {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="bg-card text-card-foreground shadow border border-primary overflow-hidden rounded-md">
        <AccordionItem value="item-1">
          <div className="px-6">
            <AccordionTrigger className="!text-sm font-bold [&[data-state=open]]:border-b border-primary -mx-6 px-4 [&>svg]:size-6 [&>svg]:text-black hover:no-underline">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="size-6" />}
                {title}
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent className="p-4">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
