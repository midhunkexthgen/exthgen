interface StaticParamsConfig {
  endpoint: string;
  idField?: string;
  queryParams?: string;
}
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function generateEntityStaticParams({
  endpoint,
  idField = "id",
  queryParams = "?populate=*",
}: StaticParamsConfig) {
  try {
    const res = await fetch(
      `${baseUrl}/api/${endpoint}${queryParams}`
    );
    const data = await res.json();
    const items = data?.data || [];

    return items.map((item: any) => ({
      id: item[idField].toString(),
    }));
  } catch (error) {
    console.error(`Failed to generate static params for ${endpoint}:`, error);
    return [];
  }
}
