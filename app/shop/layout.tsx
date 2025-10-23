// This layout disables pre-rendering for the shop page
// to ensure fresh product data is always fetched
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
