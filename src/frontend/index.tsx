import ForgeReconciler, {
  Spinner,
  Text,
  useProductContext,
} from "@forge/react";
import React from "react";
import { formatNumberWords } from "./number-words";

const View = () => {
  const context = useProductContext();
  if (!context) return <Spinner label="Loading number in words" />;
  return <Text>{formatNumberWords(context.extension["fieldValue"])}</Text>;
};

ForgeReconciler.render(
  <React.StrictMode>
    <View />
  </React.StrictMode>,
);
