interface AreaData {
  area?: number | string;
  areaUnit?: string;
  areaSqFt?: number;
  sqft?: number;
}

export function formatArea(data: AreaData): string {
  const area = Number(data.area);
  const equivalent = data.areaSqFt ?? data.sqft;

  if (Number.isFinite(area) && area > 0 && data.areaUnit) {
    const formattedArea = area.toLocaleString('en-IN');
    if (data.areaUnit === 'sq ft' || equivalent == null) {
      return `${formattedArea} ${data.areaUnit}`;
    }
    return `${formattedArea} ${data.areaUnit} (${equivalent.toLocaleString('en-IN')} sq ft)`;
  }

  return equivalent == null ? '' : `${equivalent.toLocaleString('en-IN')} sq ft`;
}