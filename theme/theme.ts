import { extendTheme } from "@chakra-ui/react";
import typography from "./foundation/typography";

const overrides = {
  ...typography,
};

export const theme = extendTheme(overrides);
