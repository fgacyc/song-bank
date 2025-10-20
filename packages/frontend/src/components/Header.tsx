import { ThemeToggle } from "@/features/theme";
import React from "react";

const Header = () => {
  return (
    <header className="flex justify-end gap-2 p-4">
      <ThemeToggle variant="buttons" size="md" />
    </header>
  );
};

export default Header;
