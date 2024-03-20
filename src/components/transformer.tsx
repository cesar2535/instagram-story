import { createContext } from "@/utils/context";
import { useState } from "react";
import type { StoryContext } from "./types";

const [Provider, useContext] = createContext<StoryContext>();

type Props = {
  id: string;
  swipedDelta: number;
  onChange?: (idx: number) => void;
  onError?: (err: Error) => void;
};

type ProcessingType = "next" | "previous" | "current" | null;

export default function Transformer(props: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [processing, setProcessing] = useState<ProcessingType>(null);

  return (
    <Provider value>
      <div className="scene">
        <div className="container"></div>
      </div>
    </Provider>
  );
}
