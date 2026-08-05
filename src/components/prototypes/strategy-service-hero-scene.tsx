"use client";

import type { CSSProperties } from "react";

type SceneStyle = CSSProperties & Record<`--${string}`, string>;

const modules = [
  {
    accent: "signal",
    order: "0",
    scatterX: "-4.75rem",
    scatterY: "-3.5rem",
    x: "18%",
    y: "23%",
  },
  {
    accent: "paper",
    order: "1",
    scatterX: "0rem",
    scatterY: "-5rem",
    x: "50%",
    y: "16%",
  },
  {
    accent: "coral",
    order: "2",
    scatterX: "4.75rem",
    scatterY: "-3.25rem",
    x: "82%",
    y: "25%",
  },
  {
    accent: "coral",
    order: "3",
    scatterX: "-4.5rem",
    scatterY: "3.5rem",
    x: "21%",
    y: "72%",
  },
  {
    accent: "paper",
    order: "4",
    scatterX: "0rem",
    scatterY: "5rem",
    x: "50%",
    y: "83%",
  },
  {
    accent: "signal",
    order: "5",
    scatterX: "4.75rem",
    scatterY: "3.25rem",
    x: "80%",
    y: "70%",
  },
] as const;

const connectors = [
  { angle: "-143deg", length: "40%", order: "0" },
  { angle: "-90deg", length: "34%", order: "1" },
  { angle: "-37deg", length: "40%", order: "2" },
  { angle: "143deg", length: "38%", order: "3" },
  { angle: "90deg", length: "35%", order: "4" },
  { angle: "36deg", length: "38%", order: "5" },
] as const;

export function StrategyServiceHeroScene({ active }: { active: boolean }) {
  return (
    <div
      className="strategy-hero-scene absolute inset-0"
      data-active={active ? "true" : "false"}
      data-testid="strategy-service-hero-scene"
    >
      <div className="strategy-hero-scene__ambient" />
      <div className="strategy-hero-scene__perspective">
        <div className="strategy-hero-scene__plane">
          <div className="strategy-hero-scene__grid" />
          <div className="strategy-hero-scene__base" />
          {connectors.map((connector) => (
            <span
              className="strategy-hero-scene__connector"
              key={connector.order}
              style={
                {
                  "--connector-angle": connector.angle,
                  "--connector-length": connector.length,
                  "--order": connector.order,
                } as SceneStyle
              }
            />
          ))}
          {modules.map((module) => (
            <span
              className="strategy-hero-scene__module"
              data-accent={module.accent}
              key={module.order}
              style={
                {
                  "--module-x": module.x,
                  "--module-y": module.y,
                  "--order": module.order,
                  "--scatter-x": module.scatterX,
                  "--scatter-y": module.scatterY,
                } as SceneStyle
              }
            >
              <span className="strategy-hero-scene__module-point" />
              <span className="strategy-hero-scene__module-lines" />
            </span>
          ))}
          <span className="strategy-hero-scene__core">
            <span className="strategy-hero-scene__core-ring" />
            <span className="strategy-hero-scene__core-point" />
          </span>
        </div>
      </div>
    </div>
  );
}
