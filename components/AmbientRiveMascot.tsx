"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from "@rive-app/react-canvas";

type AmbientRiveMascotProps = {
  className?: string;
  src?: string;
  artboard?: string;
  stateMachineName?: string;
};

const DEFAULT_SRC = "/rive/ambient-mascot-placeholder.riv";
const DEFAULT_STATE_MACHINE = "Mascot";

export default function AmbientRiveMascot({
  className = "",
  src = DEFAULT_SRC,
  artboard,
  stateMachineName = DEFAULT_STATE_MACHINE,
}: AmbientRiveMascotProps) {
  const [isHovering, setIsHovering] = useState(false);
  const riveRef = useRef<{ play: () => void } | null>(null);

  const layout = useMemo(
    () =>
      new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    [],
  );

  const { RiveComponent, rive } = useRive({
    src,
    artboard,
    stateMachines: stateMachineName,
    autoplay: true,
    layout,
    onRiveReady: (loadedRive) => {
      riveRef.current = loadedRive;
    },
  });

  const hoverInput = useStateMachineInput(rive, stateMachineName, "isHovering");
  const cursorXInput = useStateMachineInput(rive, stateMachineName, "cursorX");
  const cursorYInput = useStateMachineInput(rive, stateMachineName, "cursorY");
  const clickInput = useStateMachineInput(rive, stateMachineName, "react");

  const setHovering = useCallback(
    (nextValue: boolean) => {
      setIsHovering(nextValue);
      if (hoverInput) hoverInput.value = nextValue;
    },
    [hoverInput],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!cursorXInput && !cursorYInput) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      if (cursorXInput) cursorXInput.value = Math.min(1, Math.max(0, x));
      if (cursorYInput) cursorYInput.value = Math.min(1, Math.max(0, y));
    },
    [cursorXInput, cursorYInput],
  );

  const handleClick = useCallback(() => {
    if (clickInput && "fire" in clickInput) {
      clickInput.fire();
      return;
    }

    riveRef.current?.play();
  }, [clickInput]);

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <button
        type="button"
        tabIndex={-1}
        className={[
          "pointer-events-auto block h-24 w-24 overflow-hidden rounded-full",
          "bg-white/5 ring-1 ring-white/10 backdrop-blur-sm",
          "transition duration-300 ease-out",
          isHovering ? "scale-[1.03] opacity-95" : "scale-100 opacity-80",
          "sm:h-28 sm:w-28 md:h-32 md:w-32",
        ].join(" ")}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        aria-label="Ambient mascot"
      >
        <RiveComponent className="h-full w-full" />
      </button>
    </div>
  );
}
