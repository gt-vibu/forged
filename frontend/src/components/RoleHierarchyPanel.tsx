import React from "react";
import { motion } from "motion/react";
import { Shield, Settings, User } from "lucide-react";

export const RoleHierarchyPanel: React.FC = () => {
  // Easing curve
  const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const svgPaths = [
    "M128.161 74.6764C79.9989 130.001 71.9994 46.0005 20.9815 111.737",
    "M216.999 9.99985C260.499 12.4998 222.499 71.9998 291.999 58.9998",
    "M130.102 70.9998C144.499 -32.0002 183.852 70.2739 219.999 3.99985",
    "M14.4999 16.9998C111 20.9998 -53.0003 73.4998 21.4999 107",
  ];

  const dots = [
    { cx: 9.519, cy: 15.519 },
    { cx: 289.519, cy: 59.518 },
    { cx: 220.519, cy: 9.519 },
    { cx: 125.518, cy: 78.519 },
    { cx: 19.519, cy: 104.519 },
  ];

  return (
    <div className="relative aspect-[435/263] w-full rounded-2xl overflow-hidden glass-panel-light p-4 shadow-xl select-none">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-blue-50/70 pointer-events-none" />

      {/* SVG Permission Connection Lines Overlay */}
      <svg
        className="absolute left-[13.8%] top-[24.3%] w-[68.7%] h-auto pointer-events-none overflow-visible"
        viewBox="0 0 299.037 142.509"
      >
        {/* Draw paths */}
        {svgPaths.map((pathStr, index) => (
          <motion.path
            key={`path-${index}`}
            d={pathStr}
            fill="none"
            stroke="#ffda00"
            strokeWidth="2.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.1,
              delay: 0.55 + index * 0.12,
              ease: EXPO_OUT,
            }}
          />
        ))}

        {/* Data flow indicators */}
        {svgPaths.map((pathStr, index) => (
          <path
            key={`flow-${index}`}
            d={pathStr}
            fill="none"
            stroke="transparent"
            strokeWidth="1"
            className="overflow-visible"
          >
            {/* Permission flow particle */}
            <circle r="4" fill="#002a35">
              <animateMotion
                dur={`${2.5 + index * 0.3}s`}
                repeatCount="indefinite"
                path={pathStr}
                rotate="auto"
              />
            </circle>
          </path>
        ))}

        {/* Connection nodes/dots */}
        {dots.map((dot, idx) => (
          <g key={`dot-group-${idx}`}>
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r="9.519"
              fill="#ffda00"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 14,
                delay: 1.1 + idx * 0.1,
              }}
            />
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r="3.389"
              fill="#002a35"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 14,
                delay: 1.15 + idx * 0.1,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Role Node: Super Admin */}
      <div className="absolute left-[26.0%] top-[22%] -ml-10 text-[10px] font-bold text-dark text-center w-20 pointer-events-none">
        SUPER ADMIN
      </div>
      <motion.div
        className="absolute left-[26.0%] top-[28.9%] w-[14.9%] aspect-square rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer border-2 border-[#002a35]/10"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.12,
          y: -4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 16,
          delay: 1.6,
        }}
      >
        <Shield className="w-[42%] h-[42%] text-dark" />
      </motion.div>

      {/* Role Node: Admin */}
      <div className="absolute left-[70.8%] top-[9%] -ml-10 text-[10px] font-bold text-dark text-center w-20 pointer-events-none">
        ADMIN
      </div>
      <motion.div
        className="absolute left-[70.8%] top-[15.6%] w-[14.9%] aspect-square rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer border-2 border-[#002a35]/10"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.12,
          y: -4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 16,
          delay: 1.7,
        }}
      >
        <Settings className="w-[42%] h-[42%] text-dark animate-spin-slow" />
      </motion.div>

      {/* Role Node: User */}
      <div className="absolute left-[55.2%] top-[66%] -ml-10 text-[10px] font-bold text-dark text-center w-20 pointer-events-none">
        USER
      </div>
      <motion.div
        className="absolute left-[55.2%] top-[52.1%] w-[14.9%] aspect-square rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer border-2 border-[#002a35]/10"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.12,
          y: -4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 16,
          delay: 1.8,
        }}
      >
        <User className="w-[42%] h-[42%] text-dark" />
      </motion.div>

      {/* Panel Description Caption */}
      <motion.div
        className="absolute left-[55.6%] top-[89%] width-[44%] text-[10px] sm:text-[11px] md:text-[12px] text-dark font-medium leading-tight opacity-0 hidden sm:block"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.9, ease: EXPO_OUT }}
      >
        Every role sees exactly what it needs — full visibility, zero overreach.
      </motion.div>
    </div>
  );
};
