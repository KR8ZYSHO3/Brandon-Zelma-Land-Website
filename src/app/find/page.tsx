import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { WatchRadarForm } from "@/components/forms/WatchRadarForm";
import { ListingCard } from "@/components/listings/ListingCard";
import { getListingsByMission, getActiveListings } from "@/lib/listings-store";
import { sortListingsByFit } from "@/lib/fit-score";
import { MISSIONS, type MissionId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mission Lab",
  description:
    "Match live SE Ohio land to your mission. Land Fit Scores + Buyer Watch Radar with Brandon Zelma, Buckeye Land Sales.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    mission?: string;
    budget?: string;
    acres?: string;
  }>;
};

export default async function FindPage({ searchParams }: Props) {
  const sp = await searchParams;
  const mission = MISSIONS.find((m) => m.id === sp.mission)?.id as
    | MissionId
    | undefined;
  const budgetMax = sp.budget ? Number(sp.budget) : undefined;
  const acresMin = sp.acres ? Number(sp.acres) : undefined;

  let ranked: ReturnType<typeof sortListingsByFit> = [];
  if (mission) {
    const matched = await getListingsByMission(mission);
    // If mission filter empty, still score all actives for that mission intent
    const pool =
      matched.length > 0 ? matched : await getActiveListings();
    ranked = sortListingsByFit(pool, {
      mission,
      budgetMax: budgetMax && !Number.isNaN(budgetMax) ? budgetMax : undefined,
      acresMin: acresMin && !Number.isNaN(acresMin) ? acresMin : undefined,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Mission Lab
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Portals ask for price and acres. We score{" "}
        <strong className="text-charcoal">Land Fit</strong> for what the land
        needs to <em>do</em> — then put you on{" "}
        <strong className="text-charcoal">Watch Radar</strong> when inventory
        hits.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MISSIONS.map((m) => {
          const active = mission === m.id;
          return (
            <a
              key={m.id}
              href={`/find?mission=${m.id}`}
              className={`rounded-2xl border p-4 transition ${
                active
                  ? "border-moss bg-forest-mid text-charcoal"
                  : "border-line bg-paper hover:border-moss"
              }`}
            >
              <p className="font-display text-lg font-semibold">{m.label}</p>
              <p
                className={`mt-1 text-sm ${active ? "text-cream" : "text-muted"}`}
              >
                {m.description}
              </p>
            </a>
          );
        })}
      </div>

      {mission && (
        <form
          method="get"
          className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-paper p-4"
        >
          <input type="hidden" name="mission" value={mission} />
          <label className="text-sm">
            <span className="text-muted">Max budget ($)</span>
            <input
              name="budget"
              type="number"
              min={0}
              defaultValue={budgetMax || ""}
              className="mt-1 block w-36 rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              placeholder="optional"
            />
          </label>
          <label className="text-sm">
            <span className="text-muted">Min acres</span>
            <input
              name="acres"
              type="number"
              min={0}
              defaultValue={acresMin || ""}
              className="mt-1 block w-28 rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              placeholder="optional"
            />
          </label>
          <button
            type="submit"
            className="rounded-full btn-action px-4 py-2 text-sm font-semibold"
          >
            Re-rank by Fit
          </button>
          <p className="text-xs text-muted sm:ml-2">
            Adjust filters — cards sort by Land Fit Score for{" "}
            {MISSIONS.find((m) => m.id === mission)?.label}.
          </p>
        </form>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              Save your land mission
            </h2>
            <p className="mt-2 text-sm text-muted">
              One-time profile into Brandon&apos;s pipeline with a priority
              score.
            </p>
            <div className="mt-6">
              <LeadForm
                type="buyer"
                source="mission-lab"
                defaultMission={mission}
              />
            </div>
          </div>
          <div>
            <WatchRadarForm defaultMission={mission} />
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-forest">
            {mission
              ? `Ranked fits · ${MISSIONS.find((m) => m.id === mission)?.label}`
              : "Pick a mission to rank live inventory"}
          </h2>
          {mission ? (
            <div className="mt-6 grid gap-4">
              {ranked.length === 0 ? (
                <p className="text-sm text-muted">
                  No live inventory yet — activate Watch Radar so Brandon
                  prospects for you.
                </p>
              ) : (
                ranked.map(({ listing, fit }) => (
                  <div key={listing.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-2 px-1">
                      <p className="text-xs font-semibold text-muted">
                        Land Fit {fit.score} · {fit.label}
                      </p>
                      <p className="line-clamp-1 text-[11px] text-muted">
                        {fit.reasons[0]}
                      </p>
                    </div>
                    <ListingCard listing={listing} mission={mission} />
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Choose Hunt, Farm, Homestead, or Timber above. Each card shows a
              Land Fit Score for that mission.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
