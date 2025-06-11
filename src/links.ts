const BASE_URL = "https://app.getdx.com";

export function entityScorecardsUrl({
  entityIdentifier,
  scorecardId,
}: {
  entityIdentifier: string;
  scorecardId?: string;
}) {
  let url = `${BASE_URL}/catalog/${entityIdentifier}/scorecards`;
  if (scorecardId) {
    url += `?expanded=${scorecardId}`;
  }
  return url;
}
