import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface ExpandableCardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'card' | 'category';
}

const accordionStyles = {
    card: "bg-card text-card-foreground shadow border border-primary",
    category: "[&>div]:border-0"
};

const triggerStyles = {
    card: "px-6 [&[data-state=open]]:border-b border-primary",
    category: "px-6 [&>div]:border-0 pb-1"
};

export default function ExpandableCard({ 
  title, 
  children, 
  icon: Icon, 
  variant = 'card'
}: ExpandableCardProps) {

  return (
    <div className="w-full">
      <Accordion 
        type="single" 
        collapsible 
        className={`${accordionStyles[variant]} overflow-hidden rounded-md`}
      >
        <AccordionItem value="item-1">
          {/* <div className="px-6">÷ */}
            <AccordionTrigger className={`!text-sm font-bold ${triggerStyles[variant]} [&>svg]:size-6 [&>svg]:text-black hover:no-underline`}>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="size-6" />}
                {title}
              </div>
            </AccordionTrigger>
          {/* </div> */}
          <AccordionContent>
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
