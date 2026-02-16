import React, { useRef, memo, useMemo } from "react";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

// Memoized default title component
const DefaultTitle = memo(() => (
  <span>
    This Macbook is built with Tailwindcss. <br /> No kidding.
  </span>
));
DefaultTitle.displayName = "DefaultTitle";

export const MacbookScroll = memo(
  ({
    src,
    children,
    showGradient,
    title,
    badge,
  }: {
    src?: string;
    children?: React.ReactNode;
    showGradient?: boolean;
    title?: string | React.ReactNode;
    badge?: React.ReactNode;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "45% start"],
    });

    // Memoize transform configurations
    const transforms = useMemo(
      () => ({
        scaleX: useTransform(scrollYProgress, [0, 0.5], [1.2, 2]),
        scaleY: useTransform(scrollYProgress, [0, 0.5], [0.6, 2]),
        translate: useTransform(scrollYProgress, [0, 0.8], [0, 800]),
        rotate: useTransform(scrollYProgress, [0.1, 0.2, 0.5], [-28, -28, 0]),
        textTransform: useTransform(scrollYProgress, [0, 0.5], [0, 100]),
        textOpacity: useTransform(scrollYProgress, [0, 0.4], [1, 0]),
      }),
      [scrollYProgress]
    );

    // Memoize title to prevent re-creation
    const titleContent = useMemo(() => {
      return title || <DefaultTitle />;
    }, [title]);

    return (
      <div
        ref={ref}
        className="flex min-h-[60vh] shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-50 md:scale-100 md:py-20"
      >
        <motion.h2
          style={{
            translateY: transforms.textTransform,
            opacity: transforms.textOpacity,
          }}
          className="mb-20 text-center text-3xl font-bold text-neutral-800 dark:text-white"
        >
          {titleContent}
        </motion.h2>
        <Lid
          src={src}
          children={children}
          scaleX={transforms.scaleX}
          scaleY={transforms.scaleY}
          rotate={transforms.rotate}
          translate={transforms.translate}
        />
        {/* Base area */}
        <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
          <div className="relative h-10 w-full">
            <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
          </div>
          <div className="relative flex">
            <div className="mx-auto h-full w-[10%] overflow-hidden">
              <SpeakerGrid />
            </div>
            <div className="mx-auto h-full w-[80%]">
              <Keypad />
            </div>
            <div className="mx-auto h-full w-[10%] overflow-hidden">
              <SpeakerGrid />
            </div>
          </div>
          <Trackpad />
          <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
          {showGradient && (
            <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black"></div>
          )}
          {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
        </div>
      </div>
    );
  }
);

MacbookScroll.displayName = "MacbookScroll";

// Memoized lid back styles
const lidBackStyle = {
  transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
  transformOrigin: "bottom",
  transformStyle: "preserve-3d" as const,
};

const lidBackInsetStyle = {
  boxShadow: "0px 2px 0px 2px #171717 inset",
};

export const Lid = memo(
  ({
    scaleX,
    scaleY,
    rotate,
    translate,
    src,
    children,
  }: {
    scaleX: MotionValue<number>;
    scaleY: MotionValue<number>;
    rotate: MotionValue<number>;
    translate: MotionValue<number>;
    src?: string;
    children?: React.ReactNode;
  }) => {
    // Memoize motion style object
    const motionStyle = useMemo(
      () => ({
        scaleX,
        scaleY,
        rotateX: rotate,
        translateY: translate,
        transformStyle: "preserve-3d" as const,
        transformOrigin: "top",
      }),
      [scaleX, scaleY, rotate, translate]
    );

    return (
      <div className="relative [perspective:800px]">
        <div
          style={lidBackStyle}
          className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
        >
          <div
            style={lidBackInsetStyle}
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
          >
            <span className="text-white hover:scale-1.5">Tushar Deomare</span>
          </div>
        </div>
        <motion.div
          style={motionStyle}
          className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
        >
          <div className="absolute inset-0 rounded-lg bg-[#272729]" />
          {children ? (
            <div className="absolute inset-0 h-full w-full rounded-lg overflow-hidden">
              {children}
            </div>
          ) : src ? (
            <img
              src={src}
              alt="aceternity logo"
              className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
            />
          ) : null}
        </motion.div>
      </div>
    );
  }
);

Lid.displayName = "Lid";

// Memoized trackpad style
const trackpadStyle = {
  boxShadow: "0px 0px 1px 1px #00000020 inset",
};

export const Trackpad = memo(() => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={trackpadStyle}
    ></div>
  );
});

Trackpad.displayName = "Trackpad";

// Memoize key button style
const kBtnInnerStyle = {
  boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
};

export const KBtn = memo(
  ({
    className,
    children,
    childrenClassName,
    backlit = true,
  }: {
    className?: string;
    children?: React.ReactNode;
    childrenClassName?: string;
    backlit?: boolean;
  }) => {
    return (
      <div
        className={cn(
          "[transform:translateZ(0)] rounded-[4px] p-[0.5px]",
          backlit && "bg-white/[0.2] shadow-xl shadow-white"
        )}
      >
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]",
            className
          )}
          style={kBtnInnerStyle}
        >
          <div
            className={cn(
              "flex w-full flex-col items-center justify-center text-[5px] text-neutral-200",
              childrenClassName,
              backlit && "text-white"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

KBtn.displayName = "KBtn";

// Memoized speaker grid style
const speakerGridStyle = {
  backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
  backgroundSize: "3px 3px",
};

export const SpeakerGrid = memo(() => {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={speakerGridStyle}
    ></div>
  );
});

SpeakerGrid.displayName = "SpeakerGrid";

export const OptionKey = memo(({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
});

OptionKey.displayName = "OptionKey";

// Extracted keyboard rows as separate memoized components for better performance
const FirstRow = memo(() => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
    <KBtn
      className="w-10 items-end justify-start pb-[2px] pl-[4px]"
      childrenClassName="items-start"
    >
      esc
    </KBtn>
    <KBtn>
      <IconBrightnessDown className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F1</span>
    </KBtn>
    <KBtn>
      <IconBrightnessUp className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F2</span>
    </KBtn>
    <KBtn>
      <IconTable className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F3</span>
    </KBtn>
    <KBtn>
      <IconSearch className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F4</span>
    </KBtn>
    <KBtn>
      <IconMicrophone className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F5</span>
    </KBtn>
    <KBtn>
      <IconMoon className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F6</span>
    </KBtn>
    <KBtn>
      <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F7</span>
    </KBtn>
    <KBtn>
      <IconPlayerSkipForward className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F8</span>
    </KBtn>
    <KBtn>
      <IconPlayerTrackNext className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F9</span>
    </KBtn>
    <KBtn>
      <IconVolume3 className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F10</span>
    </KBtn>
    <KBtn>
      <IconVolume2 className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F11</span>
    </KBtn>
    <KBtn>
      <IconVolume className="h-[6px] w-[6px]" />
      <span className="mt-1 inline-block">F12</span>
    </KBtn>
    <KBtn>
      <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
        <div className="h-full w-full rounded-full bg-black" />
      </div>
    </KBtn>
  </div>
));
FirstRow.displayName = "FirstRow";

const SecondRow = memo(() => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
    <KBtn>
      <span className="block">~</span>
      <span className="mt-1 block">`</span>
    </KBtn>
    <KBtn>
      <span className="block">!</span>
      <span className="block">1</span>
    </KBtn>
    <KBtn>
      <span className="block">@</span>
      <span className="block">2</span>
    </KBtn>
    <KBtn>
      <span className="block">#</span>
      <span className="block">3</span>
    </KBtn>
    <KBtn>
      <span className="block">$</span>
      <span className="block">4</span>
    </KBtn>
    <KBtn>
      <span className="block">%</span>
      <span className="block">5</span>
    </KBtn>
    <KBtn>
      <span className="block">^</span>
      <span className="block">6</span>
    </KBtn>
    <KBtn>
      <span className="block">&</span>
      <span className="block">7</span>
    </KBtn>
    <KBtn>
      <span className="block">*</span>
      <span className="block">8</span>
    </KBtn>
    <KBtn>
      <span className="block">(</span>
      <span className="block">9</span>
    </KBtn>
    <KBtn>
      <span className="block">)</span>
      <span className="block">0</span>
    </KBtn>
    <KBtn>
      <span className="block">&mdash;</span>
      <span className="block">_</span>
    </KBtn>
    <KBtn>
      <span className="block">+</span>
      <span className="block"> = </span>
    </KBtn>
    <KBtn
      className="w-10 items-end justify-end pr-[4px] pb-[2px]"
      childrenClassName="items-end"
    >
      delete
    </KBtn>
  </div>
));
SecondRow.displayName = "SecondRow";

const ThirdRow = memo(() => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
    <KBtn
      className="w-10 items-end justify-start pb-[2px] pl-[4px]"
      childrenClassName="items-start"
    >
      tab
    </KBtn>
    <KBtn>
      <span className="block">Q</span>
    </KBtn>
    <KBtn>
      <span className="block">W</span>
    </KBtn>
    <KBtn>
      <span className="block">E</span>
    </KBtn>
    <KBtn>
      <span className="block">R</span>
    </KBtn>
    <KBtn>
      <span className="block">T</span>
    </KBtn>
    <KBtn>
      <span className="block">Y</span>
    </KBtn>
    <KBtn>
      <span className="block">U</span>
    </KBtn>
    <KBtn>
      <span className="block">I</span>
    </KBtn>
    <KBtn>
      <span className="block">O</span>
    </KBtn>
    <KBtn>
      <span className="block">P</span>
    </KBtn>
    <KBtn>
      <span className="block">{`{`}</span>
      <span className="block">{`[`}</span>
    </KBtn>
    <KBtn>
      <span className="block">{`}`}</span>
      <span className="block">{`]`}</span>
    </KBtn>
    <KBtn>
      <span className="block">{`|`}</span>
      <span className="block">{`\\`}</span>
    </KBtn>
  </div>
));
ThirdRow.displayName = "ThirdRow";

const FourthRow = memo(() => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
    <KBtn
      className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]"
      childrenClassName="items-start"
    >
      caps lock
    </KBtn>
    <KBtn>
      <span className="block">A</span>
    </KBtn>
    <KBtn>
      <span className="block">S</span>
    </KBtn>
    <KBtn>
      <span className="block">D</span>
    </KBtn>
    <KBtn>
      <span className="block">F</span>
    </KBtn>
    <KBtn>
      <span className="block">G</span>
    </KBtn>
    <KBtn>
      <span className="block">H</span>
    </KBtn>
    <KBtn>
      <span className="block">J</span>
    </KBtn>
    <KBtn>
      <span className="block">K</span>
    </KBtn>
    <KBtn>
      <span className="block">L</span>
    </KBtn>
    <KBtn>
      <span className="block">{`:`}</span>
      <span className="block">{`;`}</span>
    </KBtn>
    <KBtn>
      <span className="block">{`"`}</span>
      <span className="block">{`'`}</span>
    </KBtn>
    <KBtn
      className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
      childrenClassName="items-end"
    >
      return
    </KBtn>
  </div>
));
FourthRow.displayName = "FourthRow";

const FifthRow = memo(() => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
    <KBtn
      className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]"
      childrenClassName="items-start"
    >
      shift
    </KBtn>
    <KBtn>
      <span className="block">Z</span>
    </KBtn>
    <KBtn>
      <span className="block">X</span>
    </KBtn>
    <KBtn>
      <span className="block">C</span>
    </KBtn>
    <KBtn>
      <span className="block">V</span>
    </KBtn>
    <KBtn>
      <span className="block">B</span>
    </KBtn>
    <KBtn>
      <span className="block">N</span>
    </KBtn>
    <KBtn>
      <span className="block">M</span>
    </KBtn>
    <KBtn>
      <span className="block">{`<`}</span>
      <span className="block">{`,`}</span>
    </KBtn>
    <KBtn>
      <span className="block">{`>`}</span>
      <span className="block">{`.`}</span>
    </KBtn>
    <KBtn>
      <span className="block">{`?`}</span>
      <span className="block">{`/`}</span>
    </KBtn>
    <KBtn
      className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
      childrenClassName="items-end"
    >
      shift
    </KBtn>
  </div>
));
FifthRow.displayName = "FifthRow";

const SixthRow = memo(() => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
    <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
      <div className="flex w-full justify-end pr-1">
        <span className="block">fn</span>
      </div>
      <div className="flex w-full justify-start pl-1">
        <IconWorld className="h-[6px] w-[6px]" />
      </div>
    </KBtn>
    <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
      <div className="flex w-full justify-end pr-1">
        <IconChevronUp className="h-[6px] w-[6px]" />
      </div>
      <div className="flex w-full justify-start pl-1">
        <span className="block">control</span>
      </div>
    </KBtn>
    <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
      <div className="flex w-full justify-end pr-1">
        <OptionKey className="h-[6px] w-[6px]" />
      </div>
      <div className="flex w-full justify-start pl-1">
        <span className="block">option</span>
      </div>
    </KBtn>
    <KBtn className="w-8" childrenClassName="h-full justify-between py-[4px]">
      <div className="flex w-full justify-end pr-1">
        <IconCommand className="h-[6px] w-[6px]" />
      </div>
      <div className="flex w-full justify-start pl-1">
        <span className="block">command</span>
      </div>
    </KBtn>
    <KBtn className="w-[8.2rem]"></KBtn>
    <KBtn className="w-8" childrenClassName="h-full justify-between py-[4px]">
      <div className="flex w-full justify-start pl-1">
        <IconCommand className="h-[6px] w-[6px]" />
      </div>
      <div className="flex w-full justify-start pl-1">
        <span className="block">command</span>
      </div>
    </KBtn>
    <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
      <div className="flex w-full justify-start pl-1">
        <OptionKey className="h-[6px] w-[6px]" />
      </div>
      <div className="flex w-full justify-start pl-1">
        <span className="block">option</span>
      </div>
    </KBtn>
    <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
      <KBtn className="h-3 w-6">
        <IconCaretUpFilled className="h-[6px] w-[6px]" />
      </KBtn>
      <div className="flex">
        <KBtn className="h-3 w-6">
          <IconCaretLeftFilled className="h-[6px] w-[6px]" />
        </KBtn>
        <KBtn className="h-3 w-6">
          <IconCaretDownFilled className="h-[6px] w-[6px]" />
        </KBtn>
        <KBtn className="h-3 w-6">
          <IconCaretRightFilled className="h-[6px] w-[6px]" />
        </KBtn>
      </div>
    </div>
  </div>
));
SixthRow.displayName = "SixthRow";

export const Keypad = memo(() => {
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1">
      <FirstRow />
      <SecondRow />
      <ThirdRow />
      <FourthRow />
      <FifthRow />
      <SixthRow />
    </div>
  );
});

Keypad.displayName = "Keypad";
