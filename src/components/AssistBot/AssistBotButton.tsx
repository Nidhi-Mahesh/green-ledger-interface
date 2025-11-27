import { useState } from "react";
import { MessageCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssistBotModal from "./AssistBotModal";

const AssistBotButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-40 group"
        size="icon"
      >
        <div className="relative">
          <MessageCircle className="w-7 h-7 text-white" />
          <Leaf className="w-3 h-3 text-white absolute -top-1 -right-1" />
        </div>
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-card text-foreground text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-border">
          Ask AssistBot
        </span>
      </Button>

      {/* Modal */}
      <AssistBotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default AssistBotButton;
