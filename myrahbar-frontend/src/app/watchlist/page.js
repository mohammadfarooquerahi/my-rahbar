import WatchlistClient from "./WatchlistClient";

export const metadata = {
  title: "My Watchlist | Rahbars",
  robots: { index: false },
};

export default function WatchlistPage() {
  return <WatchlistClient />;
}
