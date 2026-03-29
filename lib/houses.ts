export type House = {
  id: number;
  address: string;
  homeowner: string;
  price: number;
  photoURL: string;
};

export type HousesSuccessResponse = {
  houses: House[];
  ok: true;
};

export type HousesErrorResponse = {
  message: string;
  ok: false;
};

export type HousesApiResponse = HousesSuccessResponse | HousesErrorResponse;

export const PER_PAGE = 20;

export const HOUSES_API_URL =
  "https://staging.homevision.co/api_project/houses";

export async function fetchHousesPage(
  page: number,
  perPage: number,
): Promise<HousesSuccessResponse> {
  const url = new URL(HOUSES_API_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  let res: Response;
  try {
    res = await fetch(url.toString());
  } catch {
    throw new Error("Could not reach the server.");
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error("The response was not valid JSON.");
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}.`);
  }

  if (
    typeof json !== "object" ||
    json === null ||
    !("ok" in json) ||
    typeof (json as { ok: unknown }).ok !== "boolean"
  ) {
    throw new Error("Invalid response shape.");
  }

  const body = json as HousesApiResponse;

  if (!body.ok) {
    throw new Error(body.message || "The API returned an error.");
  }

  if (!Array.isArray(body.houses)) {
    throw new Error("The houses list in the response is invalid.");
  }

  return body;
}

export function getPageForHouseId(id: number, perPage = PER_PAGE): number {
  return Math.floor(id / perPage) + 1;
}

/**
 * No individual-house endpoint exists; we derive the page from the id
 * and fetch the paginated list to find the house within the response.
 * Network retries are handled by React Query (`retry`) on the consumer.
 */
export async function fetchHouseById(
  id: number,
  perPage = PER_PAGE,
): Promise<House | null> {
  const page = getPageForHouseId(id, perPage);
  const { houses } = await fetchHousesPage(page, perPage);
  return houses.find((h) => h.id === id) ?? null;
}
