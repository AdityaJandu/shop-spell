import { StorefrontPage } from "@/modules/storefront/presentation/ui/StorefrontPage";

type Props = {
  params: Promise<{ storeId: string }>;
};

export default async function Page({ params }: Props) {
  const { storeId } = await params;
  return <StorefrontPage storeId={storeId} />;
}
