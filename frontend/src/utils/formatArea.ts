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
    const unit = data.areaUnit === 'sq yd/gaj' ? 'gaj' : data.areaUnit;
    if (unit === 'sq ft' || equivalent == null) {
      return `${formattedArea} ${unit}`;
    }
    return `${formattedArea} ${unit} (${equivalent.toLocaleString('en-IN')} sq ft)`;
  }

  return equivalent == null ? '' : `${equivalent.toLocaleString('en-IN')} sq ft`;
}