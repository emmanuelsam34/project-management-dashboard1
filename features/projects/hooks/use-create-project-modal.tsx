"use client";


let useQueryState: any;
let parseAsBoolean: any;

if (typeof window !== "undefined") {
  const nuqs = require("nuqs");
  useQueryState = nuqs.useQueryState;
  parseAsBoolean = nuqs.parseAsBoolean;
} else {
  
  useQueryState = (): [boolean, (value: boolean) => void] => [false, () => {}];
  parseAsBoolean = {
    withDefault: (defaultVal: boolean) => ({
      withOptions: (_opts: any): any => ({})
    })
  };
}

export const useCreateProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-project",
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
      shallow: true,
    })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
