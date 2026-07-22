type GovernedRecord = {
  isPublished?: boolean;
  isPlaceholder?: boolean;
  isVerified?: boolean;
};

/**
 * A single public-rendering gate for factual records. If a governance flag is
 * present it must explicitly pass; unverified proof can never leak through a
 * presentational component by accident.
 */
export function isPublicRecord<T extends GovernedRecord>(record: T): boolean {
  if ("isPublished" in record && record.isPublished !== true) return false;
  if (record.isPlaceholder === true) return false;
  if ("isVerified" in record && record.isVerified !== true) return false;
  return true;
}

export function publicRecords<T extends GovernedRecord>(records: T[]): T[] {
  return records.filter(isPublicRecord);
}
