import pluralizeLib from "pluralize";

const pluralRules = new Intl.PluralRules("en-US");

export function pluralize(text: string, count: number) {
  if (count !== null && pluralRules.select(count) === "one") {
    return pluralizeLib.singular(text);
  }
  return pluralizeLib.plural(text);
}
