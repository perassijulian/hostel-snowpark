import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const BodyOverflowContext = createContext({
  setOverflow: (value: boolean) => {},
});

export const useBodyOverflow = () => useContext(BodyOverflowContext);

export const BodyOverflowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Manage the overflow style in the body based on isMenuOpen state
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Ensure cleanup
    };
  }, [isMenuOpen]);

  // Provide the context value
  return (
    <BodyOverflowContext.Provider value={{ setOverflow: setIsMenuOpen }}>
      {children}
    </BodyOverflowContext.Provider>
  );
};
