import React from "react";

interface FooterProps {
  message?: string;
}

export const Footer: React.FC<FooterProps> = ({
  message = "Created by Javier Medina",
}) => {
  return (
    <footer className="text-gray-600 text-center py-4 bg-gray-50 overflow-hidden">
      {message}
    </footer>
  );
};
