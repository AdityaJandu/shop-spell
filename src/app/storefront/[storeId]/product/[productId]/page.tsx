import { ProductDetailPage } from "@/modules/storefront/presentation/ui/ProductDetailPage";

type Props = {
  params: Promise<{ storeId: string; productId: string }>;
};

export default async function Page({ params }: Props) {
  const { storeId, productId } = await params;
  return <ProductDetailPage storeId={storeId} productId={productId} />;
}
